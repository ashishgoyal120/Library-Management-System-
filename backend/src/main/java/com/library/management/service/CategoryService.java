package com.library.management.service;

import com.library.management.dto.CategoryDTO;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.model.Category;
import com.library.management.repository.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAll() {
        return categoryRepository.findAll().stream().map(Mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO getById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        return Mapper.toDto(c);
    }

    @Transactional
    public CategoryDTO create(CategoryDTO dto) {
        categoryRepository.findByNameIgnoreCase(dto.getName()).ifPresent(existing -> {
            throw new BadRequestException("Category name already exists: " + dto.getName());
        });

        Category c = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        Category saved = categoryRepository.save(c);
        log.info("Created category id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public CategoryDTO update(Long id, CategoryDTO dto) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        categoryRepository.findByNameIgnoreCase(dto.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Category name already exists: " + dto.getName());
            }
        });

        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        Category saved = categoryRepository.save(c);
        log.info("Updated category id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        categoryRepository.delete(c);
        log.info("Deleted category id={}", id);
    }
}

