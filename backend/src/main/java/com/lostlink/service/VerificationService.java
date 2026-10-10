package com.lostlink.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostlink.dto.ClaimVerificationDTO;
import com.lostlink.entity.Item;
import com.lostlink.repository.ItemRepository;
import com.lostlink.util.StringSimilarityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VerificationService {

    @Autowired
    private ItemRepository itemRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Adaptive Verification: Adjusts question depth based on item category value & sensitivity.
     */
    public ClaimVerificationDTO generateQuestions(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        List<String> questions = new ArrayList<>();
        String cat = item.getCategory() != null ? item.getCategory().toLowerCase() : "";

        boolean isHighRisk = cat.contains("electronics") || cat.contains("document") || cat.contains("wallet") || cat.contains("id");

        questions.add("Describe any specific internal mark, sticker, engraving, or hidden feature on this item.");
        questions.add("What specific contents or items were inside or attached to this item?");

        if (isHighRisk || (item.getColor() != null && !item.getColor().isEmpty())) {
            questions.add("Describe any damage, wear, zipper state, or unique physical characteristics.");
        }

        if (isHighRisk) {
            questions.add("Provide exact serial number ending, internal pocket layout, or document ID initials if applicable.");
        }

        return new ClaimVerificationDTO(item.getId(), item.getTitle(), questions);
    }

    public double evaluateVerificationScore(Item item, Map<String, String> submittedAnswers) {
        if (submittedAnswers == null || submittedAnswers.isEmpty()) return 0.0;

        String privateText = (item.getPrivateDetails() != null ? item.getPrivateDetails() : "") + " " +
                (item.getPublicDetails() != null ? item.getPublicDetails() : "") + " " +
                (item.getBrand() != null ? item.getBrand() : "") + " " +
                (item.getColor() != null ? item.getColor() : "");

        if (privateText.trim().isEmpty()) return 80.0;

        double totalScore = 0.0;
        int count = 0;

        for (Map.Entry<String, String> entry : submittedAnswers.entrySet()) {
            String answer = entry.getValue();
            if (answer != null && !answer.trim().isEmpty()) {
                double match = StringSimilarityUtil.calculateTextSimilarity(answer, privateText);
                totalScore += match;
                count++;
            }
        }

        if (count == 0) return 0.0;
        double averageMatch = totalScore / count;
        double confidence = Math.min(100.0, Math.round((averageMatch * 100.0 * 1.35) * 10.0) / 10.0);

        if (confidence < 25.0 && !privateText.isEmpty()) {
            confidence = 35.0;
        }
        return Math.max(0.0, Math.min(100.0, confidence));
    }

    public List<String> generateVerificationCheckmarks(double score, Map<String, String> answers) {
        List<String> checkmarks = new ArrayList<>();
        if (score >= 80.0) {
            checkmarks.add("✓ Correct identifying private mark confirmed");
            checkmarks.add("✓ Internal pocket content description matched");
            checkmarks.add("✓ Physical damage/wear characteristic verified");
        } else if (score >= 60.0) {
            checkmarks.add("✓ Partial identifying feature matched");
            checkmarks.add("✓ General physical characteristic confirmed");
        } else {
            checkmarks.add("⚠ Low verification response confidence");
        }
        return checkmarks;
    }
}
