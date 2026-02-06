package com.library.management.service;

import com.library.management.dto.DashboardStatsDTO;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getStats() {
        long totalBooks = bookRepository.count();
        long availableBooks = bookRepository.countByAvailableCopiesGreaterThan(0);
        long borrowed = borrowRecordRepository.countActiveBorrows();
        long members = userRepository.count();
        long overdue = borrowRecordRepository.countOverdue(LocalDate.now());

        return DashboardStatsDTO.builder()
                .totalBooksCount(totalBooks)
                .availableBooksCount(availableBooks)
                .borrowedBooksCount(borrowed)
                .totalMembersCount(members)
                .overdueBooksCount(overdue)
                .build();
    }
}

