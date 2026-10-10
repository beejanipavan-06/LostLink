package com.lostlink.dto;

import java.util.List;
import java.util.Map;

public class AdminStatsDTO {

    private long totalUsers;
    private long totalLostItems;
    private long totalFoundItems;
    private long totalRecoveredItems;
    private long pendingClaims;
    private long suspiciousClaims;
    private double recoveryRate;

    private Map<String, Long> itemsByCategory;
    private Map<String, Long> itemsByLocation;
    private List<String> dynamicInsights;

    public AdminStatsDTO() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalLostItems() { return totalLostItems; }
    public void setTotalLostItems(long totalLostItems) { this.totalLostItems = totalLostItems; }

    public long getTotalFoundItems() { return totalFoundItems; }
    public void setTotalFoundItems(long totalFoundItems) { this.totalFoundItems = totalFoundItems; }

    public long getTotalRecoveredItems() { return totalRecoveredItems; }
    public void setTotalRecoveredItems(long totalRecoveredItems) { this.totalRecoveredItems = totalRecoveredItems; }

    public long getPendingClaims() { return pendingClaims; }
    public void setPendingClaims(long pendingClaims) { this.pendingClaims = pendingClaims; }

    public long getSuspiciousClaims() { return suspiciousClaims; }
    public void setSuspiciousClaims(long suspiciousClaims) { this.suspiciousClaims = suspiciousClaims; }

    public double getRecoveryRate() { return recoveryRate; }
    public void setRecoveryRate(double recoveryRate) { this.recoveryRate = recoveryRate; }

    public Map<String, Long> getItemsByCategory() { return itemsByCategory; }
    public void setItemsByCategory(Map<String, Long> itemsByCategory) { this.itemsByCategory = itemsByCategory; }

    public Map<String, Long> getItemsByLocation() { return itemsByLocation; }
    public void setItemsByLocation(Map<String, Long> itemsByLocation) { this.itemsByLocation = itemsByLocation; }

    public List<String> getDynamicInsights() { return dynamicInsights; }
    public void setDynamicInsights(List<String> dynamicInsights) { this.dynamicInsights = dynamicInsights; }
}
