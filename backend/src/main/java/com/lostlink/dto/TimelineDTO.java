package com.lostlink.dto;

import java.time.LocalDateTime;

public class TimelineDTO {

    private Long id;
    private Long itemId;
    private String eventType;
    private String description;
    private LocalDateTime createdAt;

    public TimelineDTO() {}

    public TimelineDTO(Long id, Long itemId, String eventType, String description, LocalDateTime createdAt) {
        this.id = id;
        this.itemId = itemId;
        this.eventType = eventType;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
