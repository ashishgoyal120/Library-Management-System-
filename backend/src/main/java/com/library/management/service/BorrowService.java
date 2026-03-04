package com.library.management.service;

import com.library.management.dto.BorrowRecordDTO;
import com.library.management.dto.BorrowRequestDTO;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.model.Book;
import com.library.management.model.BorrowRecord;
import com.library.management.model.BorrowStatus;
import com.library.management.model.User;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BorrowService {

    private static final int DEFAULT_DUE_DAYS = 14;

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public BorrowRecordDTO issueBook(BorrowRequestDTO req) {
        Book book = bookRepository.findById(req.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + req.getBookId()));
        if (!userRepository.existsById(req.getUserId())) {
            throw new ResourceNotFoundException("User not found: " + req.getUserId());
        }
        User user = userRepository.getReferenceById(req.getUserId());

        if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
            throw new BadRequestException("Book is not available to borrow.");
        }

        LocalDate borrowDate = req.getBorrowDate() != null ? req.getBorrowDate() : LocalDate.now();
        LocalDate dueDate;
        if (req.getDueDate() != null) {
            dueDate = req.getDueDate();
        } else {
            int dueDays = req.getDueDays() != null ? req.getDueDays() : DEFAULT_DUE_DAYS;
            dueDate = borrowDate.plusDays(dueDays);
        }

        if (dueDate.isBefore(borrowDate)) {
            throw new BadRequestException("dueDate cannot be before borrowDate");
        }

        BorrowRecord br = BorrowRecord.builder()
                .book(book)
                .user(user)
                .borrowDate(borrowDate)
                .dueDate(dueDate)
                .returnDate(null)
                .status(BorrowStatus.BORROWED)
                .build();

        // decrement availability
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord saved = borrowRecordRepository.save(br);
        log.info("Issued bookId={} to userId={}, borrowRecordId={}", book.getId(), user.getId(), saved.getId());
        return Mapper.toDto(saved);
    }

    @Transactional
    public BorrowRecordDTO returnBook(Long borrowRecordId) {
        BorrowRecord br = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found: " + borrowRecordId));

        if (br.getStatus() == BorrowStatus.RETURNED || br.getReturnDate() != null) {
            throw new BadRequestException("This borrow record is already returned.");
        }

        Book book = br.getBook();
        if (book == null) {
            throw new BadRequestException("Borrow record has no book associated.");
        }

        br.setReturnDate(LocalDate.now());
        br.setStatus(BorrowStatus.RETURNED);

        // increment availability (cap at totalCopies)
        int total = book.getTotalCopies() != null ? book.getTotalCopies() : 0;
        int available = book.getAvailableCopies() != null ? book.getAvailableCopies() : 0;
        if (available < total) {
            book.setAvailableCopies(available + 1);
        }
        bookRepository.save(book);

        BorrowRecord saved = borrowRecordRepository.save(br);
        log.info("Returned borrowRecordId={}, bookId={}", saved.getId(), book.getId());
        return Mapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<BorrowRecordDTO> getActiveBorrows() {
        return borrowRecordRepository.findActiveDtos(LocalDate.now());
    }

    @Transactional
    public List<BorrowRecordDTO> getOverdue() {
        List<BorrowRecord> overdue = borrowRecordRepository.findOverdueActive(LocalDate.now());
        // update status to OVERDUE to reflect spec
        overdue.forEach(br -> br.setStatus(BorrowStatus.OVERDUE));
        borrowRecordRepository.saveAll(overdue);
        return borrowRecordRepository.findOverdueDtos(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<BorrowRecordDTO> getUserHistory(Long userId) {
        // fail fast if user doesn't exist
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found: " + userId);
        }
        return borrowRecordRepository.findUserHistoryDtos(userId, LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<BorrowRecordDTO> getBookHistory(Long bookId) {
        bookRepository.findById(bookId).orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));
        return borrowRecordRepository.findBookHistoryDtos(bookId, LocalDate.now());
    }
}

