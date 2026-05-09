package com.fullstacktask.notesapi.service;

import com.fullstacktask.notesapi.dto.LoginRequest;
import com.fullstacktask.notesapi.dto.LoginResponse;
import com.fullstacktask.notesapi.dto.RegisterRequest;
import com.fullstacktask.notesapi.dto.UserResponse;
import com.fullstacktask.notesapi.exception.ConflictException;
import com.fullstacktask.notesapi.exception.UnauthorizedException;
import com.fullstacktask.notesapi.model.User;
import com.fullstacktask.notesapi.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthService(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userService.getUserEntityByEmail(request.email().trim());
        if (!user.getPassword().equals(request.password())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        UserResponse userResponse = userService.toResponse(user);
        return new LoginResponse("Login successful", userResponse);
    }

    public LoginResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ConflictException("Email is already in use");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(request.password());

        User savedUser = userRepository.save(user);
        UserResponse userResponse = userService.toResponse(savedUser);
        return new LoginResponse("Registration successful", userResponse);
    }
}
