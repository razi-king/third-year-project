package com.example.smartvendorapp.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.entity.Vendor;
import com.example.smartvendorapp.dto.UserDto;
import com.example.smartvendorapp.dto.VendorDto;
import com.example.smartvendorapp.enums.Role;
import com.example.smartvendorapp.repository.OrderRepository;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.VendorRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalVendors = vendorRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingApprovals = vendorRepository.findAll().stream()
                .filter(v -> "PENDING".equals(v.getStatus()))
                .count();

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalVendors", totalVendors,
                "totalProducts", totalProducts,
                "totalOrders", totalOrders,
                "pendingApprovals", pendingApprovals
        ));
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        List<VendorDto> dtos = vendorRepository.findAll().stream()
                .map(this::mapVendorToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/vendors/{vendorId}/approve")
    public ResponseEntity<VendorDto> approveVendor(@PathVariable UUID vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        vendor.setStatus("APPROVED");
        return ResponseEntity.ok(mapVendorToDto(vendorRepository.save(vendor)));
    }

    @PatchMapping("/vendors/{vendorId}/reject")
    public ResponseEntity<VendorDto> rejectVendor(@PathVariable UUID vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        vendor.setStatus("REJECTED");
        return ResponseEntity.ok(mapVendorToDto(vendorRepository.save(vendor)));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> dtos = userRepository.findAll().stream()
                .map(this::mapUserToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable UUID userId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(Role.valueOf(payload.get("role").toUpperCase()));
        return ResponseEntity.ok(mapUserToDto(userRepository.save(user)));
    }

    @GetMapping("/security/logs")
    public ResponseEntity<List<Map<String, Object>>> getSecurityLogs() {
        // Mock data returning secure platform audit logs
        List<Map<String, Object>> logs = List.of(
            Map.of("id", 1, "event", "Failed Login Attempt", "ip", "192.168.1.104", "user", "admin@system.local", "time", "2 mins ago", "status", "blocked"),
            Map.of("id", 2, "event", "New Device Sign-in", "ip", "203.0.113.42", "user", "vendor_joe@email.com", "time", "1 hour ago", "status", "warning"),
            Map.of("id", 3, "event", "Password Reset Requested", "ip", "198.51.100.14", "user", "customer@domain.com", "time", "3 hours ago", "status", "info")
        );
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Map<String, Object>>> getDisputes() {
        // Mock data returning active resolution tickets
        List<Map<String, Object>> disputes = List.of(
            Map.of("id", "dsp-5991", "order", "ORD-9912", "customer", "Alice Johnson", "vendor", "Tech Haven", "status", "open", "issue", "Item never arrived past delivery window."),
            Map.of("id", "dsp-5992", "order", "ORD-1120", "customer", "Charlie Brown", "vendor", "Digital Keys", "status", "investigating", "issue", "License key provided is invalid.")
        );
        return ResponseEntity.ok(disputes);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Object>> getMessages() {
        // Return an empty array representing the inbox
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Boolean>> getSettings() {
        // Mock returning configuration map
        Map<String, Boolean> config = Map.of(
            "maintenanceMode", false,
            "autoApproveVendors", false,
            "notifyAdminSignins", true,
            "suspendNewRegistrations", false
        );
        return ResponseEntity.ok(config);
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Boolean>> updateSettings(@RequestBody Map<String, Boolean> config) {
        // Returns the payload straight back confirming state persistence
        return ResponseEntity.ok(config);
    }

    @GetMapping("/reports/export")
    public ResponseEntity<byte[]> exportReport(@RequestParam String type) {
        StringBuilder csv = new StringBuilder();
        if ("Financial Audit".equals(type)) {
            csv.append("Transaction ID,Amount,Date,Status\n");
            csv.append("TXN-001,150.00,2023-10-01,Settled\n");
            csv.append("TXN-002,300.50,2023-10-02,Pending\n");
        } else if ("Vendor Directory".equals(type)) {
            csv.append("Vendor ID,Name,Email,Status\n");
            csv.append("VND-100,Tech Haven,contact@techhaven.com,Active\n");
            csv.append("VND-101,Digital Keys,support@digitalkeys.net,Active\n");
        } else {
            csv.append("Metric,Value\n");
            csv.append("Uptime,99.9%\n");
            csv.append("API Requests,15420\n");
        }

        byte[] output = csv.toString().getBytes();

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + type.toLowerCase().replace(" ", "_") + "_report.csv");
        headers.set(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(output);
    }

    private UserDto mapUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private VendorDto mapVendorToDto(Vendor vendor) {
        return VendorDto.builder()
                .id(vendor.getId())
                .user(mapUserToDto(vendor.getUser()))
                .storeName(vendor.getStoreName())
                .description(vendor.getDescription())
                .businessRegistrationNumber(vendor.getBusinessRegistrationNumber())
                .taxId(vendor.getTaxId())
                .storeLogo(vendor.getStoreLogo())
                .address(vendor.getAddress())
                .phone(vendor.getPhone())
                .status(vendor.getStatus())
                .createdAt(vendor.getCreatedAt())
                .build();
    }
}
