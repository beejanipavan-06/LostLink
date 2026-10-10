package com.lostlink.controller;

import com.lostlink.dto.MatchDTO;
import com.lostlink.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class MatchController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/{id}/matches")
    public ResponseEntity<List<MatchDTO>> getMatchesForItem(@PathVariable Long id) {
        return ResponseEntity.ok(matchingService.getMatchesForItem(id));
    }
}
