package com.lostlink.dto;

public class HandoverRequestDTO {

    private Long claimId;
    private String code;

    public HandoverRequestDTO() {}

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
