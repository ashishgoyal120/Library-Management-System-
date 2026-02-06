package com.library.management.repository;

import com.library.management.model.BorrowRecord;
import com.library.management.model.BorrowStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    @Query("""
            SELECT br
            FROM BorrowRecord br
            WHERE br.returnDate IS NULL
              AND br.status IN ('BORROWED','OVERDUE')
            ORDER BY br.dueDate ASC
            """)
    List<BorrowRecord> findActiveOrderByDueDateAsc();

    @Query("""
            SELECT br
            FROM BorrowRecord br
            WHERE br.returnDate IS NULL
              AND br.status IN ('BORROWED','OVERDUE')
              AND br.dueDate < :today
            ORDER BY br.dueDate ASC
            """)
    List<BorrowRecord> findOverdueActive(@Param("today") LocalDate today);

    List<BorrowRecord> findByUser_IdOrderByBorrowDateDesc(Long userId);

    List<BorrowRecord> findByBook_IdOrderByBorrowDateDesc(Long bookId);

    @Query("""
            SELECT COUNT(br)
            FROM BorrowRecord br
            WHERE br.returnDate IS NULL
              AND br.status IN ('BORROWED','OVERDUE')
            """)
    long countActiveBorrows();

    @Query("""
            SELECT COUNT(br)
            FROM BorrowRecord br
            WHERE br.returnDate IS NULL
              AND br.status IN ('BORROWED','OVERDUE')
              AND br.dueDate < :today
            """)
    long countOverdue(@Param("today") LocalDate today);

    boolean existsByBook_IdAndReturnDateIsNull(Long bookId);

    boolean existsByUser_IdAndReturnDateIsNull(Long userId);
}

