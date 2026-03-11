package com.example.smartvendorapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartvendorapp.dto.AuthRequest;
import com.example.smartvendorapp.dto.AuthResponse;
import com.example.smartvendorapp.dto.RegisterRequest;
import com.example.smartvendorapp.service.AuthService;
import java.util.Map;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<AuthResponse.UserDto> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(authService.getProfile(auth.getName()));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Since JWT is stateless, the client clears the token on its end.
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse.UserDto> updateProfile(@RequestBody Map<String, String> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(authService.updateProfile(auth.getName(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(@RequestBody Map<String, String> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        authService.updatePassword(auth.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/settings")
    public ResponseEntity<Void> updateSettings(@RequestBody Map<String, Boolean> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        authService.updateSettings(auth.getName(), request);
        return ResponseEntity.ok().build();
    }
}
