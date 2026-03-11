package com.example.smartvendorapp.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import com.example.smartvendorapp.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private Double totalAmount;
    private OrderStatus status;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDto> items;
}
