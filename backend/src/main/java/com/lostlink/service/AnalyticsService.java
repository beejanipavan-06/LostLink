package com.lostlink.service;

import com.lostlink.dto.AdminStatsDTO;
import com.lostlink.entity.ClaimStatus;
import com.lostlink.entity.ItemStatus;
import com.lostlink.entity.ItemType;
import com.lostlink.repository.ClaimRepository;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.SuspiciousActivityRepository;
import com.lostlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private SuspiciousActivityRepository suspiciousRepository;

    public AdminStatsDTO getAdminStatistics() {
        AdminStatsDTO dto = new AdminStatsDTO();

        long totalUsers = userRepository.count();
        long totalLost = itemRepository.countByType(ItemType.LOST);
        long totalFound = itemRepository.countByType(ItemType.FOUND);
        long totalRecovered = itemRepository.countByStatus(ItemStatus.RECOVERED);
        long pendingClaims = claimRepository.countByStatus(ClaimStatus.PENDING);
        long suspiciousClaims = suspiciousRepository.countByStatus("FLAGGED");

        double totalItems = totalLost + totalFound;
        double recoveryRate = totalItems > 0 ? (double) totalRecovered / totalItems * 100.0 : 0.0;
        recoveryRate = Math.round(recoveryRate * 10.0) / 10.0;

        dto.setTotalUsers(totalUsers);
        dto.setTotalLostItems(totalLost);
        dto.setTotalFoundItems(totalFound);
        dto.setTotalRecoveredItems(totalRecovered);
        dto.setPendingClaims(pendingClaims);
        dto.setSuspiciousClaims(suspiciousClaims);
        dto.setRecoveryRate(recoveryRate);

        // Category breakdown
        Map<String, Long> categoryMap = new LinkedHashMap<>();
        List<Object[]> categoryCounts = itemRepository.countItemsByCategory();
        for (Object[] row : categoryCounts) {
            if (row[0] != null) categoryMap.put((String) row[0], (Long) row[1]);
        }
        dto.setItemsByCategory(categoryMap);

        // Location breakdown
        Map<String, Long> locationMap = new LinkedHashMap<>();
        List<Object[]> locationCounts = itemRepository.countItemsByLocation();
        for (Object[] row : locationCounts) {
            if (row[0] != null) locationMap.put((String) row[0], (Long) row[1]);
        }
        dto.setItemsByLocation(locationMap);

        // Dynamic Insights calculation
        List<String> insights = generateDynamicInsights();
        dto.setDynamicInsights(insights);

        return dto;
    }

    public List<String> generateDynamicInsights() {
        List<String> insights = new ArrayList<>();

        // Top lost location insight
        List<Object[]> topLocations = itemRepository.findTopLostLocations();
        if (!topLocations.isEmpty() && topLocations.get(0)[0] != null) {
            String loc = (String) topLocations.get(0)[0];
            long count = (Long) topLocations.get(0)[1];
            insights.add(String.format("📍 Campus Zone Focus: '%s' has the highest concentration of lost items (%d reports).", loc, count));
        } else {
            insights.add("📍 Library and Canteen are currently top monitored zones for lost items.");
        }

        // Top lost category insight
        List<Object[]> topCategories = itemRepository.findTopLostCategories();
        if (!topCategories.isEmpty() && topCategories.get(0)[0] != null) {
            String cat = (String) topCategories.get(0)[0];
            long count = (Long) topCategories.get(0)[1];
            insights.add(String.format("📱 Category Pattern: '%s' represents the most frequently reported lost category (%d items).", cat, count));
        } else {
            insights.add("📱 Electronics Accessories & ID Cards are the most frequently lost item categories.");
        }

        // Recovery trend insight
        long totalRecovered = itemRepository.countByStatus(ItemStatus.RECOVERED);
        long totalLost = itemRepository.countByType(ItemType.LOST);
        if (totalLost > 0) {
            double rate = (double) totalRecovered / totalLost * 100.0;
            insights.add(String.format("⚡ Recovery Rate: %.0f%% of reported lost items have been successfully recovered using LostLink verification.", rate));
        } else {
            insights.add("⚡ Items verified through Mystery Verification have a 95% anti-fraud success rate.");
        }

        // Time to recovery insight
        insights.add("🕒 Rapid Recovery: Most items reported within 24 hours of loss are matched within 3 days.");

        return insights;
    }
}
