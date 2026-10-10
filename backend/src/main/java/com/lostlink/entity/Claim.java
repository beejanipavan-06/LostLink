package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private Long claimantId;

    @Column(columnDefinition = "TEXT")
    private String verificationQuestions;

    @Column(columnDefinition = "TEXT")
    private String verificationAnswers;

    private double verificationScore;

    private String claimRiskLevel = "LOW"; // LOW, MEDIUM, HIGH
    private double claimRiskScore = 15.0;

    @Column(columnDefinition = "TEXT")
    private String verificationExplanation;

    private String recoveryCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.PENDING;

    private String reviewNotes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Claim() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }

    public String getVerificationQuestions() { return verificationQuestions; }
    public void setVerificationQuestions(String verificationQuestions) { this.verificationQuestions = verificationQuestions; }

    public String getVerificationAnswers() { return verificationAnswers; }
    public void setVerificationAnswers(String verificationAnswers) { this.verificationAnswers = verificationAnswers; }

    public double getVerificationScore() { return verificationScore; }
    public void setVerificationScore(double verificationScore) { this.verificationScore = verificationScore; }

    public String getClaimRiskLevel() { return claimRiskLevel; }
    public void setClaimRiskLevel(String claimRiskLevel) { this.claimRiskLevel = claimRiskLevel; }

    public double getClaimRiskScore() { return claimRiskScore; }
    public void setClaimRiskScore(double claimRiskScore) { this.claimRiskScore = claimRiskScore; }

    public String getVerificationExplanation() { return verificationExplanation; }
    public void setVerificationExplanation(String verificationExplanation) { this.verificationExplanation = verificationExplanation; }

    public String getRecoveryCode() { return recoveryCode; }
    public void setRecoveryCode(String recoveryCode) { this.recoveryCode = recoveryCode; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
