package com.library.management.service;

import com.library.management.dto.UserDTO;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.model.User;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    @Transactional(readOnly = true)
    public List<UserDTO> getAll() {
        return userRepository.findAll().stream().map(Mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public UserDTO getById(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return Mapper.toDto(u);
    }

    @Transactional
    public UserDTO create(UserDTO dto) {
        userRepository.findByEmailIgnoreCase(dto.getEmail()).ifPresent(existing -> {
            throw new BadRequestException("Email already exists: " + dto.getEmail());
        });

        User u = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .membershipDate(dto.getMembershipDate())
                .build();
        User saved = userRepository.save(u);
        log.info("Created user id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public UserDTO update(Long id, UserDTO dto) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        userRepository.findByEmailIgnoreCase(dto.getEmail()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Email already exists: " + dto.getEmail());
            }
        });

        u.setName(dto.getName());
        u.setEmail(dto.getEmail());
        u.setPhone(dto.getPhone());
        u.setAddress(dto.getAddress());
        u.setMembershipDate(dto.getMembershipDate());

        User saved = userRepository.save(u);
        log.info("Updated user id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        boolean hasActive = borrowRecordRepository.existsByUser_IdAndReturnDateIsNull(id);
        if (hasActive) {
            throw new BadRequestException("User has active borrows and cannot be deleted.");
        }

        userRepository.delete(u);
        log.info("Deleted user id={}", id);
    }
}

