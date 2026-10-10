package com.lostlink.dto;

import java.util.List;

public class ClaimVerificationDTO {

    private Long itemId;
    private String itemTitle;
    private List<String> questions;

    public ClaimVerificationDTO() {}

    public ClaimVerificationDTO(Long itemId, String itemTitle, List<String> questions) {
        this.itemId = itemId;
        this.itemTitle = itemTitle;
        this.questions = questions;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public List<String> getQuestions() { return questions; }
    public void setQuestions(List<String> questions) { this.questions = questions; }
}
