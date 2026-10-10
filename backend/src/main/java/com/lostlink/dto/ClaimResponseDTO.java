package com.lostlink.dto;

import com.lostlink.entity.ClaimStatus;
import java.time.LocalDateTime;
import java.util.List;

public class ClaimResponseDTO {

    private Long id;
    private Long itemId;
    private ItemDTO item;
    private Long claimantId;
    private String claimantName;
    private String claimantEmail;
    private double verificationScore;

    private String claimRiskLevel;
    private double claimRiskScore;
    private List<String> verificationCheckmarks;
    private String recoveryCode;

    private ClaimStatus status;
    private String reviewNotes;
    private LocalDateTime createdAt;

    public ClaimResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public ItemDTO getItem() { return item; }
    public void setItem(ItemDTO item) { this.item = item; }

    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getClaimantEmail() { return claimantEmail; }
    public void setClaimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; }

    public double getVerificationScore() { return verificationScore; }
    public void setVerificationScore(double verificationScore) { this.verificationScore = verificationScore; }

    public String getClaimRiskLevel() { return claimRiskLevel; }
    public void setClaimRiskLevel(String claimRiskLevel) { this.claimRiskLevel = claimRiskLevel; }

    public double getClaimRiskScore() { return claimRiskScore; }
    public void setClaimRiskScore(double claimRiskScore) { this.claimRiskScore = claimRiskScore; }

    public List<String> getVerificationCheckmarks() { return verificationCheckmarks; }
    public void setVerificationCheckmarks(List<String> verificationCheckmarks) { this.verificationCheckmarks = verificationCheckmarks; }

    public String getRecoveryCode() { return recoveryCode; }
    public void setRecoveryCode(String recoveryCode) { this.recoveryCode = recoveryCode; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
