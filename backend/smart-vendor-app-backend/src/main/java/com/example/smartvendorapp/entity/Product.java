package com.example.smartvendorapp.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.smartvendorapp.enums.ProductStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Product {

 @Id
 @GeneratedValue
 private UUID id;

 private String name;

 @Column(length=2000)
 private String description;

 private Double price;

 private Integer stock;

 private String category;

 private String imageUrl;

 @Enumerated(EnumType.STRING)
 private ProductStatus status;

 @ManyToOne
 @JoinColumn(name="vendor_id")
 private Vendor vendor;

 private LocalDateTime createdAt;
 private LocalDateTime updatedAt;
}