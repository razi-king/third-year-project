package com.example.smartvendorapp.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import com.example.smartvendorapp.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private String avatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
