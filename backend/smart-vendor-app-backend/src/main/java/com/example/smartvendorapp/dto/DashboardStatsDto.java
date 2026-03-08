package com.example.smartvendorapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private Double totalRevenue;
    private Long totalOrders;
    private Long totalProducts;
    private Long totalCustomers;
    private Double revenueChange;
    private Double ordersChange;
    private Long totalVendors;
}
