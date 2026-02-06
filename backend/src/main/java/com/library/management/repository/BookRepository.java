package com.library.management.repository;

import com.library.management.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    Page<Book> findByAvailableCopiesGreaterThan(int minAvailable, Pageable pageable);

    long countByAvailableCopiesGreaterThan(int minAvailable);

    @Query("""
            SELECT b
            FROM Book b
            LEFT JOIN b.author a
            LEFT JOIN b.category c
            WHERE
              LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR (b.isbn IS NOT NULL AND LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')))
              OR (b.publisher IS NOT NULL AND LOWER(b.publisher) LIKE LOWER(CONCAT('%', :keyword, '%')))
              OR (b.description IS NOT NULL AND LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
              OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<Book> search(@Param("keyword") String keyword, Pageable pageable);
}

