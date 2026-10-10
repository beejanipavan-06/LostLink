package com.lostlink.controller;

import com.lostlink.dto.TimelineDTO;
import com.lostlink.service.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class TimelineController {

    @Autowired
    private TimelineService timelineService;

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<TimelineDTO>> getItemTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(timelineService.getItemTimeline(id));
    }
}
