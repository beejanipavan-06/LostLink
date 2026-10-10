package com.lostlink.service;

import com.lostlink.dto.*;
import com.lostlink.entity.*;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.exception.UnauthorizedException;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.UserRepository;
import com.lostlink.util.StringSimilarityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private FingerprintService fingerprintService;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private MongoSyncService mongoSyncService;

    @Transactional
    public ItemDTO createItem(Long userId, ItemCreateRequest request) {
        Item item = new Item();
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setType(request.getType());
        item.setLocation(request.getLocation());
        item.setDateReported(request.getDateReported() != null ? request.getDateReported() : LocalDate.now());
        item.setColor(request.getColor());
        item.setBrand(request.getBrand());
        item.setPublicDetails(request.getPublicDetails());
        item.setImageUrl(request.getImageUrl());

        // Location coordinates (Default to Anurag University campus presets if null)
        Double lat = request.getLatitude();
        Double lng = request.getLongitude();
        if (lat == null || lng == null) {
            String loc = request.getLocation() != null ? request.getLocation().toLowerCase() : "";
            if (loc.contains("library")) { lat = 17.4215; lng = 78.6570; }
            else if (loc.contains("canteen")) { lat = 17.4202; lng = 78.6560; }
            else if (loc.contains("lab")) { lat = 17.4212; lng = 78.6580; }
            else if (loc.contains("hostel")) { lat = 17.4225; lng = 78.6550; }
            else if (loc.contains("parking")) { lat = 17.4198; lng = 78.6555; }
            else if (loc.contains("sports")) { lat = 17.4195; lng = 78.6575; }
            else { lat = 17.4208; lng = 78.6565; } // Main Block default
        }
        item.setLatitude(lat);
        item.setLongitude(lng);
        item.setQrCodeToken(UUID.randomUUID().toString().substring(0, 8));

        item.setStatus(ItemStatus.REPORTED);
        item.setUserId(userId);

        Item savedItem = itemRepository.save(item);

        // Generate Item Fingerprint
        fingerprintService.generateFingerprint(savedItem);

        // Record initial timeline event
        String eventType = (savedItem.getType() == ItemType.LOST) ? "ITEM_LOST" : "ITEM_FOUND";
        timelineService.addEvent(savedItem.getId(), eventType,
                String.format("Report submitted for %s (%s) near %s.", savedItem.getTitle(), savedItem.getCategory(), savedItem.getLocation()));

        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            int bonus = (savedItem.getType() == ItemType.FOUND) ? 15 : 5;
            user.setRecoveryScore(user.getRecoveryScore() + bonus);
            userRepository.save(user);

            auditService.logAction(userId, user.getEmail(), "ITEM_CREATED", "ITEM", savedItem.getId(),
                    savedItem.getType() + " report created: " + savedItem.getTitle());
        }

        // Trigger Smart Matching Engine automatically
        matchingService.findAndSaveMatches(savedItem);

        ItemDTO dto = toDTO(savedItem, userId, false);
        mongoSyncService.saveItemToMongo(dto);
        mongoSyncService.logActivityToMongo("ITEM_CREATED", user != null ? user.getEmail() : "anonymous", "Created " + savedItem.getType() + " item: " + savedItem.getTitle());
        return dto;
    }

    public DuplicateCheckResponse checkDuplicateReport(DuplicateCheckRequest request) {
        List<Item> existingItems = itemRepository.findByType(request.getType());
        List<DuplicateCheckResponse.DuplicateMatch> duplicateMatches = new ArrayList<>();
        double highestScore = 0.0;

        for (Item item : existingItems) {
            if (item.getStatus() == ItemStatus.RECOVERED || item.getStatus() == ItemStatus.CLOSED) continue;

            double titleSim = StringSimilarityUtil.calculateTextSimilarity(request.getTitle(), item.getTitle());
            double locSim = StringSimilarityUtil.calculateLocationSimilarity(request.getLocation(), item.getLocation());
            double catSim = request.getCategory() != null && request.getCategory().equalsIgnoreCase(item.getCategory()) ? 1.0 : 0.0;

            double score = (titleSim * 0.45) + (locSim * 0.35) + (catSim * 0.20);
            score = Math.round(score * 100.0 * 10.0) / 10.0;

            if (score >= 60.0) {
                if (score > highestScore) highestScore = score;
                duplicateMatches.add(new DuplicateCheckResponse.DuplicateMatch(item.getId(), item.getTitle(), item.getLocation(), score));
            }
        }

        boolean isDuplicate = highestScore >= 70.0;
        return new DuplicateCheckResponse(isDuplicate, highestScore, duplicateMatches);
    }

    public Page<ItemDTO> searchItems(ItemType type, String category, String location, String color, String brand, String query, int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Item> itemPage = itemRepository.searchItems(type, category, location, color, brand, query, pageable);

        List<ItemDTO> dtos = itemPage.getContent().stream()
                .map(item -> toDTO(item, currentUserId, false))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, itemPage.getTotalElements());
    }

    public ItemDTO getItemById(Long id, Long currentUserId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        boolean isOwnerOrAdmin = currentUserId != null && (item.getUserId().equals(currentUserId) || isUserAdmin(currentUserId));
        return toDTO(item, currentUserId, isOwnerOrAdmin);
    }

    public List<ItemDTO> getUserItems(Long userId) {
        return itemRepository.findByUserId(userId).stream()
                .map(item -> toDTO(item, userId, true))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteItem(Long id, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!item.getUserId().equals(userId) && !isUserAdmin(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this item listing.");
        }

        itemRepository.delete(item);
    }

    private boolean isUserAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(u -> u.getRole() == Role.ADMIN)
                .orElse(false);
    }

    public ItemDTO toDTO(Item item, Long currentUserId, boolean includePrivate) {
        String reporterName = userRepository.findById(item.getUserId()).map(User::getFullName).orElse("Campus Student");
        return ItemDTO.fromEntity(item, reporterName, includePrivate);
    }
}
