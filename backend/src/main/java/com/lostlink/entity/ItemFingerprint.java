package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "item_fingerprints")
public class ItemFingerprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long itemId;

    private String category;
    private String itemType;
    private String brand;
    private String color;
    private String location;
    private LocalDate dateReported;

    @Column(columnDefinition = "TEXT")
    private String distinctiveFeature;

    @Column(columnDefinition = "TEXT")
    private String normalizedKeywords;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ItemFingerprint() {}

    public ItemFingerprint(Long itemId, String category, String itemType, String brand, String color, String location, LocalDate dateReported, String distinctiveFeature, String normalizedKeywords) {
        this.itemId = itemId;
        this.category = category;
        this.itemType = itemType;
        this.brand = brand;
        this.color = color;
        this.location = location;
        this.dateReported = dateReported;
        this.distinctiveFeature = distinctiveFeature;
        this.normalizedKeywords = normalizedKeywords;
    }

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

    public String getNormalizedKeywords() { return normalizedKeywords; }
    public void setNormalizedKeywords(String normalizedKeywords) { this.normalizedKeywords = normalizedKeywords; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
