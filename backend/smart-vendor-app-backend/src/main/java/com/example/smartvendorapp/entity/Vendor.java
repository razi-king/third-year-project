package com.example.smartvendorapp.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Vendor {

 @Id
 @GeneratedValue
 private UUID id;

 @OneToOne
 @JoinColumn(name="user_id", nullable = false)
 private User user;

 @Column(nullable = false)
 private String storeName;
 
 @Column(columnDefinition = "TEXT")
 private String description;
 
 private String businessRegistrationNumber;
 private String taxId;
 private String storeLogo;
 
 private String address;
 private String phone;

 @Column(nullable = false)
 @Builder.Default
 private String status = "PENDING";

 private LocalDateTime createdAt;
}