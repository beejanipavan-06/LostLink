package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suspicious_activities")
public class SuspiciousActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long itemId;

    private Long userId;

    private Long claimId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    private String status = "FLAGGED"; // FLAGGED, REVIEWED, DISMISSED

    private LocalDateTime createdAt = LocalDateTime.now();

    public SuspiciousActivity() {}

    public SuspiciousActivity(Long itemId, Long userId, Long claimId, String reason) {
        this.itemId = itemId;
        this.userId = userId;
        this.claimId = claimId;
        this.reason = reason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
