package com.library.management.service;

import com.library.management.dto.BookDTO;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.model.Author;
import com.library.management.model.Book;
import com.library.management.model.Category;
import com.library.management.repository.AuthorRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    @Transactional(readOnly = true)
    public Page<BookDTO> getAll(Pageable pageable) {
        return bookRepository.findAll(pageable).map(Mapper::toDto);
    }

    @Transactional(readOnly = true)
    public BookDTO getById(Long id) {
        Book b = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));
        return Mapper.toDto(b);
    }

    @Transactional
    public BookDTO create(BookDTO dto) {
        if (dto.getAvailableCopies() > dto.getTotalCopies()) {
            throw new BadRequestException("availableCopies cannot be greater than totalCopies");
        }

        Author a = authorRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + dto.getAuthorId()));
        Category c = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        Book b = Book.builder()
                .title(dto.getTitle())
                .isbn(dto.getIsbn())
                .publisher(dto.getPublisher())
                .publicationYear(dto.getPublicationYear())
                .totalCopies(dto.getTotalCopies())
                .availableCopies(dto.getAvailableCopies())
                .description(dto.getDescription())
                .author(a)
                .category(c)
                .build();

        Book saved = bookRepository.save(b);
        log.info("Created book id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public BookDTO update(Long id, BookDTO dto) {
        Book b = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));

        if (dto.getAvailableCopies() > dto.getTotalCopies()) {
            throw new BadRequestException("availableCopies cannot be greater than totalCopies");
        }

        Author a = authorRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: " + dto.getAuthorId()));
        Category c = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        b.setTitle(dto.getTitle());
        b.setIsbn(dto.getIsbn());
        b.setPublisher(dto.getPublisher());
        b.setPublicationYear(dto.getPublicationYear());
        b.setDescription(dto.getDescription());
        b.setAuthor(a);
        b.setCategory(c);

        // Copies logic:
        // - totalCopies can change
        // - availableCopies can change but cannot exceed totalCopies
        b.setTotalCopies(dto.getTotalCopies());
        b.setAvailableCopies(dto.getAvailableCopies());

        Book saved = bookRepository.save(b);
        log.info("Updated book id={}", saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        Book b = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + id));

        boolean activeBorrow = borrowRecordRepository.existsByBook_IdAndReturnDateIsNull(id);
        if (activeBorrow) {
            throw new BadRequestException("Book is currently borrowed and cannot be deleted.");
        }

        bookRepository.delete(b);
        log.info("Deleted book id={}", id);
    }

    @Transactional(readOnly = true)
    public Page<BookDTO> search(String keyword, Pageable pageable) {
        String safe = keyword == null ? "" : keyword.trim();
        if (safe.isBlank()) {
            return bookRepository.findAll(pageable).map(Mapper::toDto);
        }
        return bookRepository.search(safe, pageable).map(Mapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<BookDTO> getAvailable(Pageable pageable) {
        return bookRepository.findByAvailableCopiesGreaterThan(0, pageable).map(Mapper::toDto);
    }
}

