package com.library.management.controller;

import com.library.management.dto.AuthorDTO;
import com.library.management.service.AuthorService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public ResponseEntity<List<AuthorDTO>> getAll() {
        return ResponseEntity.ok(authorService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AuthorDTO> create(@Valid @RequestBody AuthorDTO dto) {
        AuthorDTO created = authorService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorDTO> update(@PathVariable Long id, @Valid @RequestBody AuthorDTO dto) {
        return ResponseEntity.ok(authorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

