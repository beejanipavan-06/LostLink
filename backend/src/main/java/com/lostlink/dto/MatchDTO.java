package com.lostlink.dto;

import com.lostlink.entity.ItemMatch;
import java.time.LocalDateTime;
import java.util.List;

public class MatchDTO {

    private Long id;
    private Long lostItemId;
    private ItemDTO lostItem;
    private Long foundItemId;
    private ItemDTO foundItem;
    private double matchScore;
    private String matchReason;
    private String confidenceLevel;

    private double categoryScore;
    private double nameScore;
    private double descriptionScore;
    private double colorScore;
    private double brandScore;
    private double locationScore;
    private double dateScore;

    private String breakdownDetails;
    private List<String> reasonCheckmarks;

    private String status;
    private LocalDateTime createdAt;

    public MatchDTO() {}

    public static String getConfidenceText(double score) {
        if (score >= 85.0) return "High Confidence Match";
        if (score >= 70.0) return "Possible Match";
        return "Low Confidence Match";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public ItemDTO getLostItem() { return lostItem; }
    public void setLostItem(ItemDTO lostItem) { this.lostItem = lostItem; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public ItemDTO getFoundItem() { return foundItem; }
    public void setFoundItem(ItemDTO foundItem) { this.foundItem = foundItem; }

    public double getMatchScore() { return matchScore; }
    public void setMatchScore(double matchScore) { this.matchScore = matchScore; }

    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public double getCategoryScore() { return categoryScore; }
    public void setCategoryScore(double categoryScore) { this.categoryScore = categoryScore; }

    public double getNameScore() { return nameScore; }
    public void setNameScore(double nameScore) { this.nameScore = nameScore; }

    public double getDescriptionScore() { return descriptionScore; }
    public void setDescriptionScore(double descriptionScore) { this.descriptionScore = descriptionScore; }

    public double getColorScore() { return colorScore; }
    public void setColorScore(double colorScore) { this.colorScore = colorScore; }

    public double getBrandScore() { return brandScore; }
    public void setBrandScore(double brandScore) { this.brandScore = brandScore; }

    public double getLocationScore() { return locationScore; }
    public void setLocationScore(double locationScore) { this.locationScore = locationScore; }

    public double getDateScore() { return dateScore; }
    public void setDateScore(double dateScore) { this.dateScore = dateScore; }

    public String getBreakdownDetails() { return breakdownDetails; }
    public void setBreakdownDetails(String breakdownDetails) { this.breakdownDetails = breakdownDetails; }

    public List<String> getReasonCheckmarks() { return reasonCheckmarks; }
    public void setReasonCheckmarks(List<String> reasonCheckmarks) { this.reasonCheckmarks = reasonCheckmarks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
