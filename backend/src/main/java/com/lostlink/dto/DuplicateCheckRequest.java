package com.lostlink.dto;

import com.lostlink.entity.ItemType;

public class DuplicateCheckRequest {

    private String title;
    private String category;
    private String description;
    private String location;
    private ItemType type;

    public DuplicateCheckRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }
}
