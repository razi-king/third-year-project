package com.example.smartvendorapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartvendorapp.dto.DashboardStatsDto;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    // Simple placeholder for analytics to satisfy frontend requirements

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalRevenue(15000.0)
                .totalOrders(142L)
                .totalProducts(56L)
                .totalCustomers(24L)
                .revenueChange(12.5)
                .ordersChange(8.0)
                .build();
        return ResponseEntity.ok(stats);
    }
}
