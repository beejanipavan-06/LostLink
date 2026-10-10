package com.lostlink.service;

import com.lostlink.dto.AuthRequest;
import com.lostlink.dto.AuthResponse;
import com.lostlink.dto.RegisterRequest;
import com.lostlink.entity.Role;
import com.lostlink.entity.User;
import com.lostlink.repository.UserRepository;
import com.lostlink.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private MongoSyncService mongoSyncService;

    private void validateUniversityEmail(String email) {
        if (email == null || !email.trim().toLowerCase().endsWith("@anurag.edu.in")) {
            throw new IllegalArgumentException("Access Restricted: Only Anurag University email addresses ending with '@anurag.edu.in' (e.g. xxxx@anurag.edu.in) are permitted.");
        }
    }

    public AuthResponse register(RegisterRequest request) {
        validateUniversityEmail(request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email address is already in use!");
        }

        Role role = Role.STUDENT;
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            role = Role.ADMIN;
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                request.getStudentId(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        userRepository.save(user);

        mongoSyncService.saveUserToMongo(user);
        mongoSyncService.logActivityToMongo("USER_REGISTER", user.getEmail(), "Registered new Anurag University user: " + user.getFullName());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, user.getId(), user.getFullName(), user.getEmail(), user.getStudentId(), user.getRole().name(), user.getRecoveryScore());
    }

    public AuthResponse login(AuthRequest request) {
        validateUniversityEmail(request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        mongoSyncService.logActivityToMongo("USER_LOGIN", user.getEmail(), "User logged in to Anurag LostLink platform");

        return new AuthResponse(jwt, user.getId(), user.getFullName(), user.getEmail(), user.getStudentId(), user.getRole().name(), user.getRecoveryScore());
    }
}
