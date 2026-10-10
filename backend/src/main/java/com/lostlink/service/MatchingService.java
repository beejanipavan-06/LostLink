package com.lostlink.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostlink.dto.ItemDTO;
import com.lostlink.dto.MatchDTO;
import com.lostlink.entity.Item;
import com.lostlink.entity.ItemMatch;
import com.lostlink.entity.ItemType;
import com.lostlink.repository.ItemMatchRepository;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.UserRepository;
import com.lostlink.util.StringSimilarityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemMatchRepository itemMatchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TimelineService timelineService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<ItemMatch> findAndSaveMatches(Item targetItem) {
        ItemType oppositeType = (targetItem.getType() == ItemType.LOST) ? ItemType.FOUND : ItemType.LOST;
        List<Item> candidates = itemRepository.findByType(oppositeType);

        List<ItemMatch> createdMatches = new ArrayList<>();

        for (Item candidate : candidates) {
            Item lostItem = (targetItem.getType() == ItemType.LOST) ? targetItem : candidate;
            Item foundItem = (targetItem.getType() == ItemType.FOUND) ? targetItem : candidate;

            double categoryScore = lostItem.getCategory() != null && lostItem.getCategory().equalsIgnoreCase(foundItem.getCategory()) ? 100.0 : 0.0;
            double nameScore = Math.round(StringSimilarityUtil.calculateTextSimilarity(lostItem.getTitle(), foundItem.getTitle()) * 100.0);

            String desc1 = (lostItem.getDescription() != null ? lostItem.getDescription() : "") + " " + (lostItem.getPublicDetails() != null ? lostItem.getPublicDetails() : "");
            String desc2 = (foundItem.getDescription() != null ? foundItem.getDescription() : "") + " " + (foundItem.getPublicDetails() != null ? foundItem.getPublicDetails() : "");
            double descScore = Math.round(StringSimilarityUtil.calculateTextSimilarity(desc1, desc2) * 100.0);

            double colorScore = Math.round(StringSimilarityUtil.calculateTextSimilarity(lostItem.getColor(), foundItem.getColor()) * 100.0);
            double brandScore = Math.round(StringSimilarityUtil.calculateTextSimilarity(lostItem.getBrand(), foundItem.getBrand()) * 100.0);
            double locationScore = Math.round(StringSimilarityUtil.calculateLocationSimilarity(lostItem.getLocation(), foundItem.getLocation()) * 100.0);
            if (lostItem.getLatitude() != null && lostItem.getLongitude() != null &&
                foundItem.getLatitude() != null && foundItem.getLongitude() != null) {
                double distKm = haversineDistance(lostItem.getLatitude(), lostItem.getLongitude(), foundItem.getLatitude(), foundItem.getLongitude());
                if (distKm <= 0.15) locationScore = Math.max(locationScore, 100.0);
                else if (distKm <= 0.4) locationScore = Math.max(locationScore, 85.0);
                else if (distKm <= 1.0) locationScore = Math.max(locationScore, 70.0);
            }

            double dateScore = Math.round(StringSimilarityUtil.calculateDateProximity(lostItem.getDateReported(), foundItem.getDateReported()) * 100.0);

            double weightedScore = (categoryScore * 0.20) +
                    (nameScore * 0.20) +
                    (descScore * 0.25) +
                    (colorScore * 0.10) +
                    (brandScore * 0.10) +
                    (locationScore * 0.10) +
                    (dateScore * 0.05);

            weightedScore = Math.min(100.0, Math.round(weightedScore * 10.0) / 10.0);

            List<String> checkmarks = generateReasonCheckmarks(lostItem, foundItem, categoryScore, nameScore, descScore, locationScore, dateScore);
            String reason = String.join(", ", checkmarks);

            if (weightedScore >= 45.0) {
                Optional<ItemMatch> existing = itemMatchRepository.findByLostItemIdAndFoundItemId(lostItem.getId(), foundItem.getId());
                ItemMatch match = existing.orElse(new ItemMatch(lostItem.getId(), foundItem.getId(), weightedScore, reason));

                match.setMatchScore(weightedScore);
                match.setMatchReason(reason);
                match.setCategoryScore(categoryScore);
                match.setNameScore(nameScore);
                match.setDescriptionScore(descScore);
                match.setColorScore(colorScore);
                match.setBrandScore(brandScore);
                match.setLocationScore(locationScore);
                match.setDateScore(dateScore);

                try {
                    match.setBreakdownDetails(objectMapper.writeValueAsString(checkmarks));
                } catch (Exception e) {
                    match.setBreakdownDetails("[]");
                }

                ItemMatch saved = itemMatchRepository.save(match);
                createdMatches.add(saved);

                if (weightedScore >= 70.0) {
                    timelineService.addEvent(lostItem.getId(), "MATCH_DETECTED",
                            String.format("Smart Match Engine detected a %.0f%% match with Found Item #%d (%s). Location proximity: %.0f%%.", weightedScore, foundItem.getId(), foundItem.getTitle(), locationScore));

                    notificationService.createNotification(
                            lostItem.getUserId(),
                            "Potential Match Found!",
                            String.format("Your lost item '%s' has an %.0f%% match with a found item near %s.", lostItem.getTitle(), weightedScore, foundItem.getLocation()),
                            "/items/" + lostItem.getId()
                    );
                }
            }
        }
        return createdMatches;
    }

    private List<String> generateReasonCheckmarks(Item lost, Item found, double catScore, double nameScore, double descScore, double locScore, double dateScore) {
        List<String> checkmarks = new ArrayList<>();
        if (catScore >= 100.0) checkmarks.add("✓ Same item category (" + lost.getCategory() + ")");
        if (nameScore >= 70.0) checkmarks.add("✓ Strong item name similarity");
        if (descScore >= 65.0) checkmarks.add("✓ Matching descriptive characteristics");
        if (lost.getBrand() != null && found.getBrand() != null && lost.getBrand().equalsIgnoreCase(found.getBrand())) {
            checkmarks.add("✓ Matching brand (" + lost.getBrand() + ")");
        }
        if (locScore >= 75.0) checkmarks.add("✓ Found near reported location (" + lost.getLocation() + ")");
        if (dateScore >= 80.0) checkmarks.add("✓ Reported within 2 days of loss");

        if (checkmarks.isEmpty()) {
            checkmarks.add("✓ General keyword and attribute overlap");
        }
        return checkmarks;
    }

    public List<MatchDTO> getMatchesForItem(Long itemId) {
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item == null) return Collections.emptyList();

        List<ItemMatch> matches = (item.getType() == ItemType.LOST)
                ? itemMatchRepository.findByLostItemId(itemId)
                : itemMatchRepository.findByFoundItemId(itemId);

        return matches.stream()
                .map(this::toDTO)
                .sorted(Comparator.comparingDouble(MatchDTO::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    public MatchDTO toDTO(ItemMatch m) {
        MatchDTO dto = new MatchDTO();
        dto.setId(m.getId());
        dto.setLostItemId(m.getLostItemId());
        dto.setFoundItemId(m.getFoundItemId());
        dto.setMatchScore(m.getMatchScore());
        dto.setMatchReason(m.getMatchReason());
        dto.setConfidenceLevel(MatchDTO.getConfidenceText(m.getMatchScore()));

        dto.setCategoryScore(m.getCategoryScore());
        dto.setNameScore(m.getNameScore());
        dto.setDescriptionScore(m.getDescriptionScore());
        dto.setColorScore(m.getColorScore());
        dto.setBrandScore(m.getBrandScore());
        dto.setLocationScore(m.getLocationScore());
        dto.setDateScore(m.getDateScore());
        dto.setBreakdownDetails(m.getBreakdownDetails());

        try {
            if (m.getBreakdownDetails() != null) {
                List<String> list = objectMapper.readValue(m.getBreakdownDetails(), List.class);
                dto.setReasonCheckmarks(list);
            }
        } catch (Exception e) {
            dto.setReasonCheckmarks(List.of(m.getMatchReason() != null ? m.getMatchReason() : "Attribute overlap"));
        }

        dto.setStatus(m.getStatus());
        dto.setCreatedAt(m.getCreatedAt());

        Item lostItem = itemRepository.findById(m.getLostItemId()).orElse(null);
        if (lostItem != null) {
            String reporter = userRepository.findById(lostItem.getUserId()).map(u -> u.getFullName()).orElse("Student");
            dto.setLostItem(ItemDTO.fromEntity(lostItem, reporter, false));
        }

        Item foundItem = itemRepository.findById(m.getFoundItemId()).orElse(null);
        if (foundItem != null) {
            String reporter = userRepository.findById(foundItem.getUserId()).map(u -> u.getFullName()).orElse("Student");
            dto.setFoundItem(ItemDTO.fromEntity(foundItem, reporter, false));
        }

        return dto;
    }

    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth radius in kilometers
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
