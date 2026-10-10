package com.lostlink.controller;

import com.lostlink.dto.ClaimRequestDTO;
import com.lostlink.dto.ClaimResponseDTO;
import com.lostlink.dto.ClaimVerificationDTO;
import com.lostlink.dto.HandoverRequestDTO;
import com.lostlink.security.UserPrincipal;
import com.lostlink.service.ClaimService;
import com.lostlink.service.RecoveryService;
import com.lostlink.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private RecoveryService recoveryService;

    @GetMapping("/verification-questions/{itemId}")
    public ResponseEntity<ClaimVerificationDTO> getVerificationQuestions(@PathVariable Long itemId) {
        return ResponseEntity.ok(verificationService.generateQuestions(itemId));
    }

    @PostMapping
    public ResponseEntity<ClaimResponseDTO> createClaim(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ClaimRequestDTO request) {
        return ResponseEntity.ok(claimService.createClaim(userPrincipal.getId(), request));
    }

    @PostMapping("/handover")
    public ResponseEntity<Map<String, Object>> confirmHandover(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody HandoverRequestDTO request) {
        boolean success = recoveryService.confirmHandover(request, userPrincipal.getId());
        return ResponseEntity.ok(Map.of("success", success, "message", "Physical handover verified! Item marked as RECOVERED ✓"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ClaimResponseDTO>> getMyClaims(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(claimService.getUserClaims(userPrincipal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponseDTO> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ClaimResponseDTO> approveClaim(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(claimService.approveClaim(id, userPrincipal.getId(), isAdmin));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ClaimResponseDTO> rejectClaim(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        String reason = body != null ? body.get("reason") : "Claim verification failed.";
        return ResponseEntity.ok(claimService.rejectClaim(id, userPrincipal.getId(), isAdmin, reason));
    }
}
