package com.example.smartvendorapp.controller;

import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.smartvendorapp.dto.OrderDto;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.dto.PageResponse;
import com.example.smartvendorapp.dto.ProductDto;
import jakarta.validation.Valid;
import com.example.smartvendorapp.dto.UserDto;
import com.example.smartvendorapp.dto.VendorDto;
import com.example.smartvendorapp.enums.OrderStatus;
import com.example.smartvendorapp.service.OrderService;
import com.example.smartvendorapp.service.ProductService;
import com.example.smartvendorapp.entity.Vendor;
import com.example.smartvendorapp.repository.VendorRepository;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.entity.Order;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.OrderRepository;
import com.example.smartvendorapp.service.ReviewService;
import java.util.Set;
import java.util.HashSet;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class VendorController {

    private final ProductService productService;
    private final OrderService orderService;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ReviewService reviewService;

    private UUID getVendorId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));
        return vendor.getId();
    }

    @GetMapping("/products")
    public ResponseEntity<PageResponse<ProductDto>> getVendorProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(productService.getProductsByVendor(getVendorId(), pageable));
    }

    // Maps to POST /api/vendor/products
    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(@Validated @RequestBody ProductDto productDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.createProduct(productDto, auth.getName()));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductDto productDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.updateProduct(id, productDto, auth.getName()));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<PageResponse<OrderDto>> getVendorOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(orderService.getOrdersByVendor(getVendorId(), status, pageable));
    }

    @GetMapping("/profile")
    public ResponseEntity<VendorDto> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElse(null);
        
        if (vendor != null) {
            return ResponseEntity.ok(mapVendorToDto(vendor));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(updates); // Mock return
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getReviews() {
        return ResponseEntity.ok(reviewService.getReviewsByVendorProduct(getVendorId()));
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Map<String, Object>>> getCustomers() {
        org.springframework.data.domain.Page<Order> orders = orderRepository.findByVendorId(getVendorId(), PageRequest.of(0, 1000));
        List<Map<String, Object>> customers = new ArrayList<>();
        Set<UUID> seenIds = new HashSet<>();
        
        for (Order order : orders) {
            User customer = order.getCustomer();
            if (customer != null && seenIds.add(customer.getId())) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", customer.getId());
                map.put("name", customer.getName());
                map.put("email", customer.getEmail());
                map.put("joinDate", customer.getCreatedAt());
                customers.add(map);
            }
        }
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", 0);
        stats.put("totalOrders", 0);
        stats.put("totalCustomers", 0);
        stats.put("activeProducts", 0);
        return ResponseEntity.ok(stats);
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
