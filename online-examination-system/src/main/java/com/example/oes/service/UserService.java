package com.example.oes.service;

import com.example.oes.dto.LoginRequest;
import com.example.oes.dto.UserRequest;
import com.example.oes.dto.UserResponse;
import com.example.oes.entity.User;
import com.example.oes.exception.ResourceConflictException;
import com.example.oes.repository.UserRepository;
import com.example.oes.exception.AuthenticationException;
import com.example.oes.dto.LoginResponse;
import com.example.oes.security.JwtService;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

//    constructor injection
public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

public List<UserResponse> getAllUsers() {

    return userRepository.findAll()
            .stream()
            .map(user -> new UserResponse(
                    user.getUserId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getUserRole(),
                    user.getAccountStatus()
            ))
            .toList();
}

    public UserResponse createUser(UserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email already registered");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        user.setUserRole("STUDENT");
        user.setAccountStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getUserId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getUserRole(),
                savedUser.getAccountStatus()
        );
    }
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

                if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

                    throw new AuthenticationException("Invalid email or password");
        }
        String token = jwtService.generateToken(
                user.getUserId(),
                user.getEmail(),
                user.getUserRole()
        );

        UserResponse userResponse = new UserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getUserRole(),
                user.getAccountStatus()
        );

        return new LoginResponse(token, userResponse);
    }

}