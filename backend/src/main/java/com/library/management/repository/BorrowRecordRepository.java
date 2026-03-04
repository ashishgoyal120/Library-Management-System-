package com.library.management.repository;

import com.library.management.dto.BorrowRecordDTO;
import com.library.management.model.BorrowRecord;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    @Query("""
            SELECT new com.library.management.dto.BorrowRecordDTO(
                br.id,
                b.id,
                b.title,
                b.isbn,
                u.id,
                u.name,
                u.email,
                br.borrowDate,
                br.dueDate,
                br.returnDate,
                br.status,
                CASE WHEN br.returnDate IS NULL AND br.dueDate < :today THEN true ELSE false END
            )
            FROM BorrowRecord br
            JOIN br.book b
            JOIN br.user u
            WHERE br.returnDate IS NULL
              AND br.status IN ('BORROWED','OVERDUE')
            ORDER BY br.dueDate ASC
            """)
    List<BorrowRecordDTO> findActiveDtos(@Param("today") LocalDate today);

    @Query("""
            SELECT new com.library.management.dto.BorrowRecordDTO(
                br.id,
                b.id,
                b.title,
                b.isbn,
                u.id,
                u.name,
                u.email,
                br.borrowDate,
                br.dueDate,
                br.returnDate,
                br.status,
                true
            )
            FROM BorrowRecord br
            JOIN br.book b
            JOIN br.user u
            WHERE br.returnDate IS NULL
              AND br.status IN ('BORROWED','OVERDUE')
              AND br.dueDate < :today
            ORDER BY br.dueDate ASC
            """)
    List<BorrowRecordDTO> findOverdueDtos(@Param("today") LocalDate today);

    @Query("""
            SELECT new com.library.management.dto.BorrowRecordDTO(
                br.id,
                b.id,
                b.title,
                b.isbn,
                u.id,
                u.name,
                u.email,
                br.borrowDate,
                br.dueDate,
                br.returnDate,
                br.status,
                CASE WHEN br.returnDate IS NULL AND br.dueDate < :today THEN true ELSE false END
            )
            FROM BorrowRecord br
            JOIN br.book b
            JOIN br.user u
            WHERE u.id = :userId
            ORDER BY br.borrowDate DESC
            """)
    List<BorrowRecordDTO> findUserHistoryDtos(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("""
            SELECT new com.library.management.dto.BorrowRecordDTO(
                br.id,
                b.id,
                b.title,
                b.isbn,
                u.id,
                u.name,
                u.email,
                br.borrowDate,
                br.dueDate,
                br.returnDate,
                br.status,
                CASE WHEN br.returnDate IS NULL AND br.dueDate < :today THEN true ELSE false END
            )
            FROM BorrowRecord br
            JOIN br.book b
            JOIN br.user u
            WHERE b.id = :bookId
            ORDER BY br.borrowDate DESC
            """)
    List<BorrowRecordDTO> findBookHistoryDtos(@Param("bookId") Long bookId, @Param("today") LocalDate today);

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

