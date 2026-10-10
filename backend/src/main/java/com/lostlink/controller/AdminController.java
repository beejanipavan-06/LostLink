package com.lostlink.controller;

import com.lostlink.dto.AdminStatsDTO;
import com.lostlink.dto.AuditLogDTO;
import com.lostlink.dto.ClaimResponseDTO;
import com.lostlink.entity.SuspiciousActivity;
import com.lostlink.service.AnalyticsService;
import com.lostlink.service.AuditService;
import com.lostlink.service.ClaimService;
import com.lostlink.service.SuspiciousActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private ClaimService claimService;

    @Autowired
    private SuspiciousActivityService suspiciousService;

    @Autowired
    private AuditService auditService;

    @GetMapping("/statistics")
    public ResponseEntity<AdminStatsDTO> getStatistics() {
        return ResponseEntity.ok(analyticsService.getAdminStatistics());
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminStatsDTO> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminStatistics());
    }

    @GetMapping("/claims")
    public ResponseEntity<List<ClaimResponseDTO>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/suspicious")
    public ResponseEntity<List<SuspiciousActivity>> getSuspiciousActivities() {
        return ResponseEntity.ok(suspiciousService.getFlaggedActivities());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLogDTO>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getRecentAuditLogs());
    }

    @PutMapping("/suspicious/{id}/resolve")
    public ResponseEntity<Void> resolveSuspiciousActivity(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "REVIEWED");
        suspiciousService.resolveActivity(id, status);
        return ResponseEntity.ok().build();
    }
}
