package com.example.oes.controller;

import com.example.oes.dto.UserRequest;
import com.example.oes.dto.UserResponse;
import com.example.oes.entity.User;
import com.example.oes.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }

}