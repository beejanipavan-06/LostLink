package com.lostlink.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

public class StringSimilarityUtil {

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "a", "an", "in", "on", "at", "to", "for", "of", "with", "and", "is", "was",
            "near", "by", "my", "lost", "found", "left", "inside", "outside", "attached", "has", "it"
    );

    private static final Map<String, String> SYNONYM_MAP = Map.ofEntries(
            Map.entry("bag", "backpack"),
            Map.entry("dark", "black"),
            Map.entry("broken", "damaged"),
            Map.entry("ring", "keychain"),
            Map.entry("keys", "keychain"),
            Map.entry("laptop", "computer"),
            Map.entry("notebook", "book"),
            Map.entry("canteen", "cafeteria"),
            Map.entry("phone", "mobile")
    );

    /**
     * Normalize text: lowercase, remove punctuation, remove stopwords, map synonyms
     */
    public static Set<String> tokenizeAndNormalize(String text) {
        if (text == null || text.trim().isEmpty()) return Collections.emptySet();
        String clean = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ");
        String[] words = clean.split("\\s+");

        Set<String> normalizedTokens = new HashSet<>();
        for (String w : words) {
            if (w.length() > 1 && !STOP_WORDS.contains(w)) {
                String mapped = SYNONYM_MAP.getOrDefault(w, w);
                normalizedTokens.add(mapped);
            }
        }
        return normalizedTokens;
    }

    /**
     * Calculate Lightweight Semantic TF-IDF & Jaccard Cosine similarity (0.0 to 1.0)
     */
    public static double calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) return 0.0;

        Set<String> tokens1 = tokenizeAndNormalize(text1);
        Set<String> tokens2 = tokenizeAndNormalize(text2);

        if (tokens1.isEmpty() && tokens2.isEmpty()) return 1.0;
        if (tokens1.isEmpty() || tokens2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(tokens1);
        intersection.retainAll(tokens2);

        Set<String> union = new HashSet<>(tokens1);
        union.addAll(tokens2);

        double jaccard = (double) intersection.size() / union.size();
        
        // Lightweight Cosine TF-IDF approximation
        double cosine = (double) intersection.size() / (Math.sqrt(tokens1.size()) * Math.sqrt(tokens2.size()));
        
        double levenshtein = calculateLevenshteinSimilarity(text1.toLowerCase().trim(), text2.toLowerCase().trim());

        return Math.max(jaccard * 0.4 + cosine * 0.6, levenshtein);
    }

    public static double calculateLevenshteinSimilarity(String s1, String s2) {
        if (s1.equals(s2)) return 1.0;
        int maxLen = Math.max(s1.length(), s2.length());
        if (maxLen == 0) return 1.0;
        int distance = computeLevenshteinDistance(s1, s2);
        return 1.0 - ((double) distance / maxLen);
    }

    private static int computeLevenshteinDistance(String s1, String s2) {
        int[] costs = new int[s2.length() + 1];
        for (int j = 0; j <= s2.length(); j++) costs[j] = j;

        for (int i = 1; i <= s1.length(); i++) {
            costs[0] = i;
            int nw = i - 1;
            for (int j = 1; j <= s2.length(); j++) {
                int cj = Math.min(1 + Math.min(costs[j], costs[j - 1]),
                        s1.charAt(i - 1) == s2.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
        }
        return costs[s2.length()];
    }

    public static double calculateDateProximity(LocalDate date1, LocalDate date2) {
        if (date1 == null || date2 == null) return 0.5;
        long daysDiff = Math.abs(ChronoUnit.DAYS.between(date1, date2));
        if (daysDiff == 0) return 1.0;
        if (daysDiff <= 3) return 0.85;
        if (daysDiff <= 7) return 0.65;
        if (daysDiff <= 14) return 0.40;
        if (daysDiff <= 30) return 0.20;
        return 0.05;
    }

    public static double calculateLocationSimilarity(String loc1, String loc2) {
        if (loc1 == null || loc2 == null) return 0.0;
        if (loc1.equalsIgnoreCase(loc2)) return 1.0;
        if (loc1.toLowerCase().contains(loc2.toLowerCase()) || loc2.toLowerCase().contains(loc1.toLowerCase())) {
            return 0.85;
        }
        return calculateTextSimilarity(loc1, loc2);
    }
}
