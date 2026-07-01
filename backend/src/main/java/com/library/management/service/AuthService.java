package com.library.management.service;

import com.library.management.dto.LoginRequestDTO;
import com.library.management.dto.LoginResponseDTO;
import com.library.management.dto.RegisterRequestDTO;
import com.library.management.exception.BadRequestException;
import com.library.management.model.AdminUser;
import com.library.management.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;

    @Transactional
    public LoginResponseDTO register(RegisterRequestDTO dto) {
        adminUserRepository.findByUsernameIgnoreCase(dto.getUsername()).ifPresent(existing -> {
            throw new BadRequestException("Username already exists: " + dto.getUsername());
        });
        adminUserRepository.findByEmailIgnoreCase(dto.getEmail()).ifPresent(existing -> {
            throw new BadRequestException("Email already exists: " + dto.getEmail());
        });

        // NOTE: For simplicity this demo stores passwords in plain text.
        // In a real application you MUST hash passwords with a strong algorithm.
        AdminUser user = AdminUser.builder()
                .username(dto.getUsername())
                .password(dto.getPassword())
                .name(dto.getName())
                .email(dto.getEmail())
                .countryCode(defaultCountryCode(dto.getCountryCode()))
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .role("ADMIN")
                .build();

        AdminUser saved = adminUserRepository.save(user);
        log.info("Registered admin user id={} username={}", saved.getId(), saved.getUsername());
        return toLoginResponse(saved);
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
        AdminUser user = adminUserRepository.findByUsernameIgnoreCase(dto.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!user.getPassword().equals(dto.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        log.info("Admin user logged in username={}", user.getUsername());
        return toLoginResponse(user);
    }

    private LoginResponseDTO toLoginResponse(AdminUser u) {
        return LoginResponseDTO.builder()
                .id(u.getId())
                .username(u.getUsername())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .build();
    }

    private String defaultCountryCode(String countryCode) {
        return countryCode == null || countryCode.isBlank() ? "+91" : countryCode;
    }
}
