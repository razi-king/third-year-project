package com.example.smartvendorapp.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

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
 @JoinColumn(name="user_id")
 private User user;

 private String shopName;
 private String description;
 private String address;
 private String phone;

 private String status;

 private LocalDateTime createdAt;
}