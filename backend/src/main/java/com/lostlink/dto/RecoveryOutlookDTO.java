package com.lostlink.dto;

import java.util.List;

public class RecoveryOutlookDTO {

    private double recoveryProbability;
    private String outlookText;
    private List<String> positiveFactors;

    public RecoveryOutlookDTO() {}

    public RecoveryOutlookDTO(double recoveryProbability, String outlookText, List<String> positiveFactors) {
        this.recoveryProbability = recoveryProbability;
        this.outlookText = outlookText;
        this.positiveFactors = positiveFactors;
    }

    public double getRecoveryProbability() { return recoveryProbability; }
    public void setRecoveryProbability(double recoveryProbability) { this.recoveryProbability = recoveryProbability; }

    public String getOutlookText() { return outlookText; }
    public void setOutlookText(String outlookText) { this.outlookText = outlookText; }

    public List<String> getPositiveFactors() { return positiveFactors; }
    public void setPositiveFactors(List<String> positiveFactors) { this.positiveFactors = positiveFactors; }
}
