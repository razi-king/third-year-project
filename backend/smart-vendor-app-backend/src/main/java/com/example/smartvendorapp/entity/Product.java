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
import jakarta.persistence.Column;
import org.hibernate.annotations.Check;

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

 @Column(nullable = false)
 private String name;

 @Column(length=2000)
 private String description;

 @Column(nullable = false)
 private Double price;

 @Column(nullable = false)
 @Check(constraints = "stock >= 0")
 private Integer stock;

 @ManyToOne
 @JoinColumn(name="category_id")
 private Category category;

 private String imageUrl;

 @Enumerated(EnumType.STRING)
 @Column(nullable = false)
 private ProductStatus status;

 @ManyToOne
 @JoinColumn(name="vendor_id", nullable = false)
 private Vendor vendor;

 private LocalDateTime createdAt;
 private LocalDateTime updatedAt;
}