package com.lostlink.dto;

import java.time.LocalDateTime;

public class RecoveryCodeDTO {

    private Long claimId;
    private Long itemId;
    private String code;
    private boolean isUsed;
    private LocalDateTime expiresAt;

    public RecoveryCodeDTO() {}

    public RecoveryCodeDTO(Long claimId, Long itemId, String code, boolean isUsed, LocalDateTime expiresAt) {
        this.claimId = claimId;
        this.itemId = itemId;
        this.code = code;
        this.isUsed = isUsed;
        this.expiresAt = expiresAt;
    }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public boolean isUsed() { return isUsed; }
    public void setUsed(boolean used) { isUsed = used; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
