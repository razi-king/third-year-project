package com.example.smartvendorapp.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.smartvendorapp.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private UUID id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String imageUrl;
    private ProductStatus status;
    private UUID vendorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
