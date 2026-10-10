package com.lostlink.dto;

import com.lostlink.entity.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ItemCreateRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String category;

    @NotNull
    private ItemType type;

    @NotBlank
    private String location;

    private LocalDate dateReported;
    private String color;
    private String brand;
    private String publicDetails;
    private String privateDetails;
    private String imageUrl;

    public ItemCreateRequest() {}

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

    public String getPrivateDetails() { return privateDetails; }
    public void setPrivateDetails(String privateDetails) { this.privateDetails = privateDetails; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    private Double latitude;
    private Double longitude;

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
