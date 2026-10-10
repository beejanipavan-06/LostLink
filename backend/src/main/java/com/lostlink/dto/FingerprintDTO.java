package com.lostlink.dto;

import java.time.LocalDate;

public class FingerprintDTO {

    private Long id;
    private Long itemId;
    private String category;
    private String itemType;
    private String brand;
    private String color;
    private String location;
    private LocalDate dateReported;
    private String distinctiveFeature;

    public FingerprintDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDateReported() { return dateReported; }
    public void setDateReported(LocalDate dateReported) { this.dateReported = dateReported; }

    public String getDistinctiveFeature() { return distinctiveFeature; }
    public void setDistinctiveFeature(String distinctiveFeature) { this.distinctiveFeature = distinctiveFeature; }
}
