package com.lostlink.service;

import com.lostlink.dto.TimelineDTO;
import com.lostlink.entity.RecoveryEvent;
import com.lostlink.repository.RecoveryEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimelineService {

    @Autowired
    private RecoveryEventRepository eventRepository;

    public RecoveryEvent addEvent(Long itemId, String eventType, String description) {
        RecoveryEvent event = new RecoveryEvent(itemId, eventType, description);
        return eventRepository.save(event);
    }

    public List<TimelineDTO> getItemTimeline(Long itemId) {
        return eventRepository.findByItemIdOrderByCreatedAtAsc(itemId).stream()
                .map(e -> new TimelineDTO(e.getId(), e.getItemId(), e.getEventType(), e.getDescription(), e.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
