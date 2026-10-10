package com.lostlink.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostlink.dto.ClaimRequestDTO;
import com.lostlink.dto.ClaimResponseDTO;
import com.lostlink.dto.ItemDTO;
import com.lostlink.entity.*;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.exception.UnauthorizedException;
import com.lostlink.repository.ClaimRepository;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private SuspiciousActivityService suspiciousService;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RecoveryService recoveryService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private MongoSyncService mongoSyncService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public ClaimResponseDTO createClaim(Long claimantId, ClaimRequestDTO request) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getStatus() == ItemStatus.RECOVERED) {
            throw new IllegalArgumentException("This item has already been recovered.");
        }

        if (item.getUserId().equals(claimantId)) {
            throw new IllegalArgumentException("You cannot claim an item you reported.");
        }

        double score = verificationService.evaluateVerificationScore(item, request.getAnswers());
        List<String> checkmarks = verificationService.generateVerificationCheckmarks(score, request.getAnswers());

        Claim claim = new Claim();
        claim.setItemId(item.getId());
        claim.setClaimantId(claimantId);
        claim.setVerificationScore(score);
        claim.setStatus(ClaimStatus.PENDING);

        // Risk level assessment
        if (score >= 80.0) {
            claim.setClaimRiskLevel("LOW");
            claim.setClaimRiskScore(15.0);
        } else if (score >= 50.0) {
            claim.setClaimRiskLevel("MEDIUM");
            claim.setClaimRiskScore(45.0);
        } else {
            claim.setClaimRiskLevel("HIGH");
            claim.setClaimRiskScore(85.0);
        }

        try {
            claim.setVerificationAnswers(objectMapper.writeValueAsString(request.getAnswers()));
            claim.setVerificationExplanation(objectMapper.writeValueAsString(checkmarks));
        } catch (JsonProcessingException e) {
            claim.setVerificationAnswers("{}");
            claim.setVerificationExplanation("[]");
        }

        Claim savedClaim = claimRepository.save(claim);

        item.setStatus(ItemStatus.CLAIM_PENDING);
        itemRepository.save(item);

        timelineService.addEvent(item.getId(), "CLAIM_SUBMITTED",
                String.format("Ownership claim submitted with %.0f%% verification confidence (Risk Level: %s).", score, claim.getClaimRiskLevel()));

        suspiciousService.checkAndFlagClaim(savedClaim);

        User claimant = userRepository.findById(claimantId).orElse(null);
        auditService.logAction(claimantId, claimant != null ? claimant.getEmail() : "user", "CLAIM_SUBMITTED", "CLAIM", savedClaim.getId(),
                "Verification confidence score: " + Math.round(score) + "%");

        notificationService.createNotification(
                item.getUserId(),
                "New Claim Received for " + item.getTitle(),
                String.format("A student requested ownership verification (%.0f%% confidence). Review now.", score),
                "/claims"
        );

        ClaimResponseDTO dto = toDTO(savedClaim);
        mongoSyncService.saveClaimToMongo(dto);
        mongoSyncService.logActivityToMongo("CLAIM_SUBMITTED", claimant != null ? claimant.getEmail() : "user", "Submitted claim for item ID: " + item.getId());
        return dto;
    }

    @Transactional
    public ClaimResponseDTO approveClaim(Long claimId, Long reviewerId, boolean isAdmin) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        Item item = itemRepository.findById(claim.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!isAdmin && !item.getUserId().equals(reviewerId)) {
            throw new UnauthorizedException("Only the finder or an admin can approve this claim.");
        }

        claim.setStatus(ClaimStatus.APPROVED);
        claim.setReviewNotes("Approved by " + (isAdmin ? "Admin" : "Item Finder"));

        // Generate temporary single-use Recovery Code
        RecoveryCode rc = recoveryService.generateRecoveryCode(claim.getId(), item.getId(), claim.getClaimantId());
        claim.setRecoveryCode(rc.getCode());

        claimRepository.save(claim);

        item.setStatus(ItemStatus.VERIFIED);
        itemRepository.save(item);

        timelineService.addEvent(item.getId(), "CLAIM_APPROVED", "Ownership claim approved. Recovery Code generated: " + rc.getCode());

        User reviewer = userRepository.findById(reviewerId).orElse(null);
        auditService.logAction(reviewerId, reviewer != null ? reviewer.getEmail() : "admin", "CLAIM_APPROVED", "CLAIM", claim.getId(),
                "Recovery code generated: " + rc.getCode());

        notificationService.createNotification(
                claim.getClaimantId(),
                "Claim Approved! Recovery Code: " + rc.getCode(),
                "Your claim for '" + item.getTitle() + "' was approved! Present code " + rc.getCode() + " during physical handover.",
                "/claims"
        );

        return toDTO(claim);
    }

    @Transactional
    public ClaimResponseDTO rejectClaim(Long claimId, Long reviewerId, boolean isAdmin, String reason) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        Item item = itemRepository.findById(claim.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!isAdmin && !item.getUserId().equals(reviewerId)) {
            throw new UnauthorizedException("Only the finder or an admin can reject this claim.");
        }

        claim.setStatus(ClaimStatus.REJECTED);
        claim.setReviewNotes(reason != null ? reason : "Claim rejected after verification review.");
        claimRepository.save(claim);

        long remainingPending = claimRepository.findByItemId(item.getId()).stream()
                .filter(c -> c.getStatus() == ClaimStatus.PENDING && !c.getId().equals(claimId))
                .count();

        if (remainingPending == 0) {
            item.setStatus(ItemStatus.OPEN);
            itemRepository.save(item);
        }

        timelineService.addEvent(item.getId(), "CLAIM_REJECTED", "Ownership claim rejected: " + claim.getReviewNotes());

        User reviewer = userRepository.findById(reviewerId).orElse(null);
        auditService.logAction(reviewerId, reviewer != null ? reviewer.getEmail() : "user", "CLAIM_REJECTED", "CLAIM", claim.getId(),
                "Reason: " + claim.getReviewNotes());

        notificationService.createNotification(
                claim.getClaimantId(),
                "Claim Status Update",
                "Your claim for '" + item.getTitle() + "' was not approved: " + claim.getReviewNotes(),
                "/claims"
        );

        return toDTO(claim);
    }

    public List<ClaimResponseDTO> getUserClaims(Long userId) {
        return claimRepository.findByClaimantId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ClaimResponseDTO> getAllClaims() {
        return claimRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ClaimResponseDTO getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        return toDTO(claim);
    }

    public ClaimResponseDTO toDTO(Claim claim) {
        ClaimResponseDTO dto = new ClaimResponseDTO();
        dto.setId(claim.getId());
        dto.setItemId(claim.getItemId());
        dto.setClaimantId(claim.getClaimantId());
        dto.setVerificationScore(claim.getVerificationScore());
        dto.setClaimRiskLevel(claim.getClaimRiskLevel());
        dto.setClaimRiskScore(claim.getClaimRiskScore());
        dto.setRecoveryCode(claim.getRecoveryCode());
        dto.setStatus(claim.getStatus());
        dto.setReviewNotes(claim.getReviewNotes());
        dto.setCreatedAt(claim.getCreatedAt());

        try {
            if (claim.getVerificationExplanation() != null) {
                List<String> list = objectMapper.readValue(claim.getVerificationExplanation(), List.class);
                dto.setVerificationCheckmarks(list);
            }
        } catch (Exception e) {
            dto.setVerificationCheckmarks(List.of("Verification details evaluated"));
        }

        Item item = itemRepository.findById(claim.getItemId()).orElse(null);
        if (item != null) {
            String reporter = userRepository.findById(item.getUserId()).map(User::getFullName).orElse("Student");
            dto.setItem(ItemDTO.fromEntity(item, reporter, false));
        }

        User claimant = userRepository.findById(claim.getClaimantId()).orElse(null);
        if (claimant != null) {
            dto.setClaimantName(claimant.getFullName());
            dto.setClaimantEmail(claimant.getEmail());
        }

        return dto;
    }
}
