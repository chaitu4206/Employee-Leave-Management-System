
package elms_backend.controller;

import elms_backend.dto.RegisterRequest;
import elms_backend.dto.LoginRequest;
import elms_backend.dto.AuthResponse;
import elms_backend.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Employee Registration
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody RegisterRequest request) {

        String result = authService.register(request);

        return ResponseEntity.ok(
            Map.of("message", result)
        );
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}
