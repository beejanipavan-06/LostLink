package com.lostlink.dto;

import com.lostlink.entity.Item;
import com.lostlink.entity.ItemStatus;
import com.lostlink.entity.ItemType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ItemDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private ItemType type;
    private String location;
    private LocalDate dateReported;
    private String color;
    private String brand;
    private String publicDetails;
    private String imageUrl;
    private ItemStatus status;
    private Long userId;
    private String reporterName;
    private LocalDateTime createdAt;
    
    // Field only present if requested by owner/admin in special secured view
    private String privateDetails;

    private Double latitude;
    private Double longitude;
    private String qrCodeToken;

    public ItemDTO() {}

    public static ItemDTO fromEntity(Item item, String reporterName, boolean includePrivate) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setCategory(item.getCategory());
        dto.setType(item.getType());
        dto.setLocation(item.getLocation());
        dto.setDateReported(item.getDateReported());
        dto.setColor(item.getColor());
        dto.setBrand(item.getBrand());
        dto.setPublicDetails(item.getPublicDetails());
        dto.setImageUrl(item.getImageUrl());
        dto.setLatitude(item.getLatitude());
        dto.setLongitude(item.getLongitude());
        dto.setQrCodeToken(item.getQrCodeToken());
        dto.setStatus(item.getStatus());
        dto.setUserId(item.getUserId());
        dto.setReporterName(reporterName);
        dto.setCreatedAt(item.getCreatedAt());

        if (includePrivate) {
            dto.setPrivateDetails(item.getPrivateDetails());
        }
        return dto;
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getQrCodeToken() { return qrCodeToken; }
    public void setQrCodeToken(String qrCodeToken) { this.qrCodeToken = qrCodeToken; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDateReported() { return dateReported; }
    public void setDateReported(LocalDate dateReported) { this.dateReported = dateReported; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getPublicDetails() { return publicDetails; }
    public void setPublicDetails(String publicDetails) { this.publicDetails = publicDetails; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getPrivateDetails() { return privateDetails; }
    public void setPrivateDetails(String privateDetails) { this.privateDetails = privateDetails; }
}
