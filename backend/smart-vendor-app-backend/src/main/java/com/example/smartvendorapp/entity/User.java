package com.example.smartvendorapp.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.smartvendorapp.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class User {

 @Id
 @GeneratedValue
 private UUID id;

 @Column(nullable = false)
 private String name;

 @Column(nullable = false, unique=true)
 private String email;

 @Column(nullable = false)
 private String password;

 @Enumerated(EnumType.STRING)
 @Column(nullable = false)
 private Role role;

 private String avatar;

 private LocalDateTime createdAt;
 private LocalDateTime updatedAt;
}