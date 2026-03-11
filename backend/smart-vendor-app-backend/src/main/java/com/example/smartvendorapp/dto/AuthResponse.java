package com.example.smartvendorapp.dto;

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
public class AuthResponse {

    private String token;
    private UUID userId;
    private Role role;
    private UserDto user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDto {
        private UUID id;
        private String email;
        private String name;
        private Role role;
        private String avatar;
    }
}
