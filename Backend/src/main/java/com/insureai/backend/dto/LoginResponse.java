package com.insureai.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private String status;
    private Long userId;
    private String fullName;
    private String email;
    private String role;
}