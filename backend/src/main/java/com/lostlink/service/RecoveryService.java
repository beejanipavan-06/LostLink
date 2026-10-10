package com.lostlink.service;

import com.lostlink.dto.HandoverRequestDTO;
import com.lostlink.dto.RecoveryCodeDTO;
import com.lostlink.dto.RecoveryOutlookDTO;
import com.lostlink.entity.*;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RecoveryService {

    @Autowired
    private RecoveryCodeRepository recoveryCodeRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemMatchRepository matchRepository;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    public RecoveryCode generateRecoveryCode(Long claimId, Long itemId, Long claimantId) {
        String code = "LL-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase() + "-" + (10 + new Random().nextInt(89));
        RecoveryCode rc = recoveryCodeRepository.findByClaimId(claimId)
                .orElse(new RecoveryCode(claimId, itemId, claimantId, code, LocalDateTime.now().plusDays(7)));

        rc.setCode(code);
        rc.setUsed(false);
        return recoveryCodeRepository.save(rc);
    }

    @Transactional
    public boolean confirmHandover(HandoverRequestDTO request, Long currentUserId) {
        RecoveryCode rc = recoveryCodeRepository.findByCode(request.getCode())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired recovery code."));

        if (rc.isUsed()) {
            throw new IllegalArgumentException("This recovery code has already been redeemed.");
        }

        Claim claim = claimRepository.findById(rc.getClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated claim not found"));

        Item item = itemRepository.findById(rc.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated item not found"));

        // Mark code as used & item as RECOVERED
        rc.setUsed(true);
        recoveryCodeRepository.save(rc);

        item.setStatus(ItemStatus.RECOVERED);
        itemRepository.save(item);

        claim.setStatus(ClaimStatus.APPROVED);
        claimRepository.save(claim);

        // Timeline & Notification & Audit
        timelineService.addEvent(item.getId(), "HANDOVER_COMPLETED", "Physical item handover completed using Recovery Code " + rc.getCode());
        timelineService.addEvent(item.getId(), "ITEM_RECOVERED", "Item successfully returned to owner! ✓");

        User finder = userRepository.findById(item.getUserId()).orElse(null);
        if (finder != null) {
            finder.setRecoveryScore(finder.getRecoveryScore() + 30);
            userRepository.save(finder);
        }

        User claimant = userRepository.findById(rc.getClaimantId()).orElse(null);
        if (claimant != null) {
            claimant.setRecoveryScore(claimant.getRecoveryScore() + 25);
            userRepository.save(claimant);
        }

        auditService.logAction(currentUserId, claimant != null ? claimant.getEmail() : "user", "HANDOVER_COMPLETED", "ITEM", item.getId(),
                "Handover code verified: " + rc.getCode());

        notificationService.createNotification(
                rc.getClaimantId(),
                "Recovery Completed!",
                "Your item '" + item.getTitle() + "' was successfully handed over and marked as RECOVERED!",
                "/items/" + item.getId()
        );

        return true;
    }

    public RecoveryOutlookDTO calculateRecoveryOutlook(Long itemId) {
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item == null) return new RecoveryOutlookDTO(50.0, "Moderate Outlook", List.of("Reported in system"));

        List<ItemMatch> matches = (item.getType() == ItemType.LOST)
                ? matchRepository.findByLostItemId(itemId)
                : matchRepository.findByFoundItemId(itemId);

        double bestMatchScore = matches.stream().mapToDouble(ItemMatch::getMatchScore).max().orElse(0.0);
        List<String> positiveFactors = new ArrayList<>();

        double prob = 50.0;
        if (bestMatchScore >= 80.0) {
            prob += 35.0;
            positiveFactors.add("+ High-confidence potential match detected (" + (int)bestMatchScore + "%)");
        } else if (bestMatchScore >= 60.0) {
            prob += 20.0;
            positiveFactors.add("+ Possible match detected in system");
        }

        String cat = item.getCategory() != null ? item.getCategory().toLowerCase() : "";
        if (cat.contains("bag") || cat.contains("id") || cat.contains("book")) {
            prob += 10.0;
            positiveFactors.add("+ Frequently recovered item category (" + item.getCategory() + ")");
        }

        positiveFactors.add("+ Active monitoring across 8 campus zones");
        prob = Math.min(95.0, Math.max(20.0, prob));

        String outlookText = prob >= 80.0 ? "High Chance of Recovery" : prob >= 60.0 ? "Good Chance of Recovery" : "Moderate Outlook";
        return new RecoveryOutlookDTO(prob, outlookText, positiveFactors);
    }
}
