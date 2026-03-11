package com.example.smartvendorapp.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

import com.example.smartvendorapp.dto.AuthRequest;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.dto.AuthResponse;
import com.example.smartvendorapp.dto.RegisterRequest;
import com.example.smartvendorapp.entity.Cart;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.entity.Vendor;
import com.example.smartvendorapp.enums.Role;
import com.example.smartvendorapp.repository.CartRepository;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.VendorRepository;
import com.example.smartvendorapp.security.CustomUserDetails;
import com.example.smartvendorapp.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new com.example.smartvendorapp.exception.DuplicateResourceException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        user = userRepository.save(user);

        if (request.getRole() == Role.VENDOR) {
            if (request.getStoreName() == null || request.getStoreName().trim().isEmpty()) {
                throw new IllegalArgumentException("Store name is required for vendor registration");
            }
            Vendor vendor = Vendor.builder()
                    .user(user)
                    .storeName(request.getStoreName())
                    .description("Pending Setup")
                    .address("Pending Setup")
                    .phone("Pending Setup")
                    .status("PENDING")
                    .createdAt(LocalDateTime.now())
                    .build();
            vendorRepository.save(vendor);
        } else if (request.getRole() == Role.CUSTOMER) {
            Cart cart = Cart.builder()
                    .customer(user)
                    .totalAmount(0.0)
                    .build();
            cartRepository.save(cart);
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return buildAuthResponse(jwtToken, user);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);

        return buildAuthResponse(jwtToken, user);
    }
    
    public AuthResponse.UserDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildUserDto(user);
    }

    public AuthResponse.UserDto updateProfile(String email, Map<String, String> request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (request.containsKey("name")) {
            user.setName(request.get("name"));
        }
        if (request.containsKey("email")) {
            user.setEmail(request.get("email"));
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return buildUserDto(user);
    }

    public void updatePassword(String email, Map<String, String> request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is not correct");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void updateSettings(String email, Map<String, Boolean> request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // For now, we simulate saving settings, as there is no specific fields in User entity for notifications.
        // Can be extended later if schema supports user settings/preferences.
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole())
                .user(buildUserDto(user))
                .build();
    }
    
    private AuthResponse.UserDto buildUserDto(User user) {
        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .build();
    }
}
