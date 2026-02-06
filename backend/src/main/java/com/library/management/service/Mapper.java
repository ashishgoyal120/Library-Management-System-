package com.library.management.service;

import com.library.management.dto.AuthorDTO;
import com.library.management.dto.BookDTO;
import com.library.management.dto.BorrowRecordDTO;
import com.library.management.dto.CategoryDTO;
import com.library.management.dto.UserDTO;
import com.library.management.model.Author;
import com.library.management.model.Book;
import com.library.management.model.BorrowRecord;
import com.library.management.model.Category;
import com.library.management.model.User;
import java.time.LocalDate;

final class Mapper {
    private Mapper() {}

    static AuthorDTO toDto(Author a) {
        return AuthorDTO.builder()
                .id(a.getId())
                .name(a.getName())
                .bio(a.getBio())
                .build();
    }

    static CategoryDTO toDto(Category c) {
        return CategoryDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .build();
    }

    static UserDTO toDto(User u) {
        return UserDTO.builder()
                .id(u.getId())
                .username(u.getUsername())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .address(u.getAddress())
                .membershipDate(u.getMembershipDate())
                .build();
    }

    static BookDTO toDto(Book b) {
        return BookDTO.builder()
                .id(b.getId())
                .title(b.getTitle())
                .isbn(b.getIsbn())
                .publisher(b.getPublisher())
                .publicationYear(b.getPublicationYear())
                .totalCopies(b.getTotalCopies())
                .availableCopies(b.getAvailableCopies())
                .description(b.getDescription())
                .authorId(b.getAuthor() != null ? b.getAuthor().getId() : null)
                .categoryId(b.getCategory() != null ? b.getCategory().getId() : null)
                .authorName(b.getAuthor() != null ? b.getAuthor().getName() : null)
                .categoryName(b.getCategory() != null ? b.getCategory().getName() : null)
                .build();
    }

    static BorrowRecordDTO toDto(BorrowRecord br) {
        boolean overdue = br.getReturnDate() == null
                && br.getDueDate() != null
                && br.getDueDate().isBefore(LocalDate.now());

        return BorrowRecordDTO.builder()
                .id(br.getId())
                .bookId(br.getBook() != null ? br.getBook().getId() : null)
                .bookTitle(br.getBook() != null ? br.getBook().getTitle() : null)
                .bookIsbn(br.getBook() != null ? br.getBook().getIsbn() : null)
                .userId(br.getUser() != null ? br.getUser().getId() : null)
                .userName(br.getUser() != null ? br.getUser().getName() : null)
                .userEmail(br.getUser() != null ? br.getUser().getEmail() : null)
                .borrowDate(br.getBorrowDate())
                .dueDate(br.getDueDate())
                .returnDate(br.getReturnDate())
                .status(br.getStatus())
                .overdue(overdue)
                .build();
    }
}

