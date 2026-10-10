package com.lostlink.dto;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String studentId;
    private String role;
    private int recoveryScore;

    public AuthResponse(String token, Long id, String fullName, String email, String studentId, String role, int recoveryScore) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.studentId = studentId;
        this.role = role;
        this.recoveryScore = recoveryScore;
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getStudentId() { return studentId; }
    public String getRole() { return role; }
    public int getRecoveryScore() { return recoveryScore; }
}
