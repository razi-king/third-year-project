package com.example.smartvendorapp.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartDto {
    private UUID id;
    private List<CartItemDto> items;
    private Double totalAmount;
}
