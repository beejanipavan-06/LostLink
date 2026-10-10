package com.lostlink.service;

import com.lostlink.entity.User;
import com.lostlink.dto.ItemDTO;
import com.lostlink.dto.ClaimResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class MongoSyncService {

    @Autowired(required = false)
    private MongoTemplate mongoTemplate;

    public void logActivityToMongo(String actionType, String userEmail, String details) {
        if (mongoTemplate == null) return;
        try {
            Map<String, Object> doc = new HashMap<>();
            doc.put("actionType", actionType);
            doc.put("userEmail", userEmail);
            doc.put("details", details);
            doc.put("university", "Anurag University");
            doc.put("timestamp", LocalDateTime.now().toString());

            mongoTemplate.save(doc, "campus_audit_logs");
            System.out.println(">>> [MongoDB Atlas] Activity saved to 'campus_audit_logs' collection: " + actionType);
        } catch (Exception e) {
            System.err.println(">>> [MongoDB Atlas Error] " + e.getMessage());
        }
    }

    public void saveUserToMongo(User user) {
        if (mongoTemplate == null || user == null) return;
        try {
            Map<String, Object> doc = new HashMap<>();
            doc.put("userId", user.getId());
            doc.put("fullName", user.getFullName());
            doc.put("email", user.getEmail());
            doc.put("studentId", user.getStudentId());
            doc.put("role", user.getRole().name());
            doc.put("recoveryScore", user.getRecoveryScore());
            doc.put("university", "Anurag University");
            doc.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : LocalDateTime.now().toString());

            mongoTemplate.save(doc, "users");
            System.out.println(">>> [MongoDB Atlas] User saved to 'users' collection: " + user.getEmail());
        } catch (Exception e) {
            System.err.println(">>> [MongoDB Atlas Error] " + e.getMessage());
        }
    }

    public void saveItemToMongo(ItemDTO item) {
        if (mongoTemplate == null || item == null) return;
        try {
            Map<String, Object> doc = new HashMap<>();
            doc.put("itemId", item.getId());
            doc.put("title", item.getTitle());
            doc.put("category", item.getCategory());
            doc.put("type", item.getType() != null ? item.getType().name() : "LOST");
            doc.put("status", item.getStatus() != null ? item.getStatus().name() : "OPEN");
            doc.put("location", item.getLocation());
            doc.put("dateReported", item.getDateReported() != null ? item.getDateReported().toString() : null);
            doc.put("color", item.getColor());
            doc.put("brand", item.getBrand());
            doc.put("description", item.getDescription());
            doc.put("publicDetails", item.getPublicDetails());
            doc.put("reporterId", item.getUserId());
            doc.put("reporterName", item.getReporterName());
            doc.put("university", "Anurag University");

            mongoTemplate.save(doc, "items");
            System.out.println(">>> [MongoDB Atlas] Item saved to 'items' collection: " + item.getTitle());
        } catch (Exception e) {
            System.err.println(">>> [MongoDB Atlas Error] " + e.getMessage());
        }
    }

    public void saveClaimToMongo(ClaimResponseDTO claim) {
        if (mongoTemplate == null || claim == null) return;
        try {
            Map<String, Object> doc = new HashMap<>();
            doc.put("claimId", claim.getId());
            doc.put("itemId", claim.getItemId());
            doc.put("itemTitle", claim.getItem() != null ? claim.getItem().getTitle() : "Item #" + claim.getItemId());
            doc.put("claimantId", claim.getClaimantId());
            doc.put("claimantName", claim.getClaimantName());
            doc.put("verificationScore", claim.getVerificationScore());
            doc.put("status", claim.getStatus() != null ? claim.getStatus().name() : "PENDING");
            doc.put("claimRiskLevel", claim.getClaimRiskLevel());
            doc.put("university", "Anurag University");

            mongoTemplate.save(doc, "claims");
            System.out.println(">>> [MongoDB Atlas] Claim saved to 'claims' collection for Item ID: " + claim.getItemId());
        } catch (Exception e) {
            System.err.println(">>> [MongoDB Atlas Error] " + e.getMessage());
        }
    }
}
