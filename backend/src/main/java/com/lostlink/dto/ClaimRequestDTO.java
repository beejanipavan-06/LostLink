package com.lostlink.dto;

import java.util.List;
import java.util.Map;

public class ClaimRequestDTO {

    private Long itemId;
    // Map of Question -> Answer submitted by claimant
    private Map<String, String> answers;

    public ClaimRequestDTO() {}

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Map<String, String> getAnswers() { return answers; }
    public void setAnswers(Map<String, String> answers) { this.answers = answers; }
}
