package com.example.oes.controller;

import com.example.oes.dto.LoginRequest;
import com.example.oes.dto.LoginResponse;
import com.example.oes.dto.UserRequest;
import com.example.oes.dto.UserResponse;
import com.example.oes.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody UserRequest request) {
        return userService.createUser(request);
    }
}