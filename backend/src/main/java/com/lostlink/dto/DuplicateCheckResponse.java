package com.lostlink.dto;

import java.util.List;

public class DuplicateCheckResponse {

    private boolean isDuplicateDetected;
    private double highestSimilarityScore;
    private List<DuplicateMatch> existingMatches;

    public DuplicateCheckResponse() {}

    public DuplicateCheckResponse(boolean isDuplicateDetected, double highestSimilarityScore, List<DuplicateMatch> existingMatches) {
        this.isDuplicateDetected = isDuplicateDetected;
        this.highestSimilarityScore = highestSimilarityScore;
        this.existingMatches = existingMatches;
    }

    public static class DuplicateMatch {
        private Long itemId;
        private String title;
        private String location;
        private double similarityScore;

        public DuplicateMatch(Long itemId, String title, String location, double similarityScore) {
            this.itemId = itemId;
            this.title = title;
            this.location = location;
            this.similarityScore = similarityScore;
        }

        public Long getItemId() { return itemId; }
        public String getTitle() { return title; }
        public String getLocation() { return location; }
        public double getSimilarityScore() { return similarityScore; }
    }

    public boolean isDuplicateDetected() { return isDuplicateDetected; }
    public void setDuplicateDetected(boolean duplicateDetected) { isDuplicateDetected = duplicateDetected; }

    public double getHighestSimilarityScore() { return highestSimilarityScore; }
    public void setHighestSimilarityScore(double highestSimilarityScore) { this.highestSimilarityScore = highestSimilarityScore; }

    public List<DuplicateMatch> getExistingMatches() { return existingMatches; }
    public void setExistingMatches(List<DuplicateMatch> existingMatches) { this.existingMatches = existingMatches; }
}
