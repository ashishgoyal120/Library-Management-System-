package com.library.management.service;

import com.library.management.dto.AuthorDTO;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.model.Author;
import com.library.management.repository.AuthorRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    @Transactional(readOnly = true)
    public List<AuthorDTO> getAll() {
        return authorRepository.findAll().stream().map(Mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public AuthorDTO getById(Long id) {
        Author a = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + id));
        return Mapper.toDto(a);
    }

    @Transactional
    public AuthorDTO create(AuthorDTO dto) {
        Author a = Author.builder()
                .name(dto.getName())
                .bio(dto.getBio())
                .build();
        Author saved = authorRepository.save(a);
        log.info("Created author id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public AuthorDTO update(Long id, AuthorDTO dto) {
        Author a = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + id));
        a.setName(dto.getName());
        a.setBio(dto.getBio());
        Author saved = authorRepository.save(a);
        log.info("Updated author id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        Author a = authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + id));
        authorRepository.delete(a);
        log.info("Deleted author id={}", id);
    }
}

