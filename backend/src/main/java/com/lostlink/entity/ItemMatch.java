package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "item_matches")
public class ItemMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long lostItemId;

    @Column(nullable = false)
    private Long foundItemId;

    @Column(nullable = false)
    private double matchScore;

    @Column(columnDefinition = "TEXT")
    private String matchReason;

    private double categoryScore;
    private double nameScore;
    private double descriptionScore;
    private double colorScore;
    private double brandScore;
    private double locationScore;
    private double dateScore;

    @Column(columnDefinition = "TEXT")
    private String breakdownDetails;

    private String status = "POTENTIAL";

    private LocalDateTime createdAt = LocalDateTime.now();

    public ItemMatch() {}

    public ItemMatch(Long lostItemId, Long foundItemId, double matchScore, String matchReason) {
        this.lostItemId = lostItemId;
        this.foundItemId = foundItemId;
        this.matchScore = matchScore;
        this.matchReason = matchReason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public double getMatchScore() { return matchScore; }
    public void setMatchScore(double matchScore) { this.matchScore = matchScore; }

    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
