package com.library.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequestDTO {
    @NotNull(message = "bookId is required")
    private Long bookId;

    @NotNull(message = "userId is required")
    private Long userId;

    // optional - defaults to today if null
    private LocalDate borrowDate;

    // optional - if set, overrides dueDays
    private LocalDate dueDate;

    @Min(value = 1, message = "dueDays must be >= 1")
    private Integer dueDays;
}

