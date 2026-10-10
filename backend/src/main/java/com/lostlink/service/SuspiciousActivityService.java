package com.lostlink.service;

import com.lostlink.entity.Claim;
import com.lostlink.entity.SuspiciousActivity;
import com.lostlink.repository.ClaimRepository;
import com.lostlink.repository.SuspiciousActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SuspiciousActivityService {

    @Autowired
    private SuspiciousActivityRepository suspiciousRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private NotificationService notificationService;

    public void checkAndFlagClaim(Claim claim) {
        long existingClaimsForItem = claimRepository.countByItemId(claim.getItemId());
        if (existingClaimsForItem > 1) {
            flagSuspicious(claim.getItemId(), claim.getClaimantId(), claim.getId(),
                    "Multiple users (" + existingClaimsForItem + ") attempting to claim the exact same item.");
        }

        if (claim.getVerificationScore() < 40.0) {
            flagSuspicious(claim.getItemId(), claim.getClaimantId(), claim.getId(),
                    String.format("Very low ownership verification confidence (%.0f%%). Potential false claim.", claim.getVerificationScore()));
        }

        List<SuspiciousActivity> userFlagged = suspiciousRepository.findByUserId(claim.getClaimantId());
        if (userFlagged.size() >= 2) {
            flagSuspicious(claim.getItemId(), claim.getClaimantId(), claim.getId(),
                    "User has multiple (" + userFlagged.size() + ") previous suspicious claim flags.");
        }
    }

    public SuspiciousActivity flagSuspicious(Long itemId, Long userId, Long claimId, String reason) {
        SuspiciousActivity sa = new SuspiciousActivity(itemId, userId, claimId, reason);
        SuspiciousActivity saved = suspiciousRepository.save(sa);

        // Notify admins if needed
        return saved;
    }

    public List<SuspiciousActivity> getFlaggedActivities() {
        return suspiciousRepository.findByStatus("FLAGGED");
    }

    public void resolveActivity(Long id, String status) {
        SuspiciousActivity sa = suspiciousRepository.findById(id).orElse(null);
        if (sa != null) {
            sa.setStatus(status); // REVIEWED, DISMISSED
            suspiciousRepository.save(sa);
        }
    }
}
