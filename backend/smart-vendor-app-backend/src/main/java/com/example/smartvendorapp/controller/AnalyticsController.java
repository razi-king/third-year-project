package com.example.smartvendorapp.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartvendorapp.dto.DashboardStatsDto;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.entity.Vendor;
import com.example.smartvendorapp.repository.OrderRepository;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.VendorRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalCustomers = userRepository.count();
        double totalRevenue = orderRepository.getTotalRevenue();
        
        if (user != null && "VENDOR".equals(user.getRole().name())) {
            Vendor vendor = vendorRepository.findByUserId(user.getId()).orElse(null);
            if (vendor != null) {
                totalProducts = productRepository.findByVendorId(vendor.getId(), org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
                totalOrders = orderRepository.findByVendorId(vendor.getId(), org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
                double vendorRev = orderRepository.getTotalRevenueForVendor(vendor.getId());
                totalRevenue = vendorRev;
            }
        }

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalCustomers(totalCustomers)
                .revenueChange(12.5)
                .ordersChange(8.0)
                .build();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/vendor")
    public ResponseEntity<java.util.Map<String, Object>> getVendorStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null || !"VENDOR".equals(user.getRole().name())) {
            return ResponseEntity.status(403).build();
        }
        
        Vendor vendor = vendorRepository.findByUserId(user.getId()).orElse(null);
        if (vendor == null) {
            return ResponseEntity.notFound().build();
        }

        long totalProducts = productRepository.findByVendorId(vendor.getId(), org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        long totalOrders = orderRepository.findByVendorId(vendor.getId(), org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        double totalSales = 0.0;
        try {
            totalSales = orderRepository.getTotalRevenueForVendor(vendor.getId());
        } catch (Exception e) {
            // Might be null if no orders
        }
        
        // Count distinct customers from orders
        long totalCustomers = orderRepository.findByVendorId(vendor.getId(), org.springframework.data.domain.Pageable.unpaged())
            .stream()
            .map(o -> o.getCustomer() != null ? o.getCustomer().getId() : null)
            .filter(java.util.Objects::nonNull)
            .distinct()
            .count();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalSales", totalSales);
        stats.put("totalCustomers", totalCustomers);
        
        return ResponseEntity.ok(stats);
    }
}
