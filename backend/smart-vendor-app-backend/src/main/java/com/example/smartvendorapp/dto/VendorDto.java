package com.example.smartvendorapp.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VendorDto {
    private UUID id;
    private UserDto user;
    private String storeName;
    private String description;
    private String businessRegistrationNumber;
    private String taxId;
    private String storeLogo;
    private String address;
    private String phone;
    private String status;
    private LocalDateTime createdAt;
}
