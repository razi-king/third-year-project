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
public class ReviewDto {
    private UUID id;
    private UUID productId;
    private UUID customerId;
    private String customerName;
    private Double rating;
    private String comment;
    private LocalDateTime createdAt;
}
