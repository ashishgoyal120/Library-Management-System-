package com.library.management.service;

import com.library.management.dto.LoginRequestDTO;
import com.library.management.dto.LoginResponseDTO;
import com.library.management.dto.RegisterRequestDTO;
import com.library.management.exception.BadRequestException;
import com.library.management.model.User;
import com.library.management.repository.UserRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public LoginResponseDTO register(RegisterRequestDTO dto) {
        userRepository.findByUsernameIgnoreCase(dto.getUsername()).ifPresent(existing -> {
            throw new BadRequestException("Username already exists: " + dto.getUsername());
        });
        userRepository.findByEmailIgnoreCase(dto.getEmail()).ifPresent(existing -> {
            throw new BadRequestException("Email already exists: " + dto.getEmail());
        });

        // NOTE: For simplicity this demo stores passwords in plain text.
        // In a real application you MUST hash passwords with a strong algorithm.
        User user = User.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .membershipDate(LocalDate.now())
                .build();

        User saved = userRepository.save(user);
        log.info("Registered user id={} username={}", saved.getId(), saved.getUsername());
        return toLoginResponse(saved);
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByUsernameIgnoreCase(dto.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!user.getPassword().equals(dto.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        log.info("User logged in username={}", user.getUsername());
        return toLoginResponse(user);
    }

    private LoginResponseDTO toLoginResponse(User u) {
        return LoginResponseDTO.builder()
                .id(u.getId())
                .username(u.getUsername())
                .name(u.getName())
                .email(u.getEmail())
                .build();
    }
}

