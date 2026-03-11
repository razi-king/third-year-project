package com.example.smartvendorapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDto {
    private UUID id;
    private UUID productId;
    private String productName;
    private Double price;
    private String imageUrl;
    private LocalDateTime createdAt;
}
