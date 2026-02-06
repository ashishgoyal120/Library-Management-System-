package com.library.management.dto;

import com.library.management.model.BorrowStatus;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRecordDTO {
    private Long id;

    private Long bookId;
    private String bookTitle;
    private String bookIsbn;

    private Long userId;
    private String userName;
    private String userEmail;

    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;

    private BorrowStatus status;
    private boolean overdue;
}

