package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_codes")
public class RecoveryCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long claimId;

    @Column(nullable = false)
    private Long itemId;

    @Column(nullable = false)
    private Long claimantId;

    @Column(nullable = false)
    private String code; // e.g. LL-7X4P-92

    private boolean isUsed = false;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    public RecoveryCode() {}

    public RecoveryCode(Long claimId, Long itemId, Long claimantId, String code, LocalDateTime expiresAt) {
        this.claimId = claimId;
        this.itemId = itemId;
        this.claimantId = claimantId;
        this.code = code;
        this.expiresAt = expiresAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Long getClaimantId() { return claimantId; }
    public void setClaimantId(Long claimantId) { this.claimantId = claimantId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public boolean isUsed() { return isUsed; }
    public void setUsed(boolean used) { isUsed = used; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
