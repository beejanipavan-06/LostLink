package com.lostlink.controller;

import com.lostlink.dto.*;
import com.lostlink.entity.ItemType;
import com.lostlink.security.UserPrincipal;
import com.lostlink.service.FingerprintService;
import com.lostlink.service.ItemService;
import com.lostlink.service.RecoveryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private FingerprintService fingerprintService;

    @Autowired
    private RecoveryService recoveryService;

    @PostMapping
    public ResponseEntity<ItemDTO> createItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ItemCreateRequest request) {
        return ResponseEntity.ok(itemService.createItem(userPrincipal.getId(), request));
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<DuplicateCheckResponse> checkDuplicate(@RequestBody DuplicateCheckRequest request) {
        return ResponseEntity.ok(itemService.checkDuplicateReport(request));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ItemDTO>> searchItems(
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(itemService.searchItems(type, category, location, color, brand, query, page, size, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItemById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(itemService.getItemById(id, userId));
    }

    @GetMapping("/{id}/fingerprint")
    public ResponseEntity<FingerprintDTO> getItemFingerprint(@PathVariable Long id) {
        return ResponseEntity.ok(fingerprintService.getFingerprint(id));
    }

    @GetMapping("/{id}/outlook")
    public ResponseEntity<RecoveryOutlookDTO> getRecoveryOutlook(@PathVariable Long id) {
        return ResponseEntity.ok(recoveryService.calculateRecoveryOutlook(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ItemDTO>> getMyItems(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(itemService.getUserItems(userPrincipal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        itemService.deleteItem(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
