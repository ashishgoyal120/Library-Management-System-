package com.library.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;

    @NotBlank(message = "title is required")
    private String title;

    private String isbn;
    private String publisher;
    private Integer publicationYear;

    @NotNull(message = "totalCopies is required")
    @Min(value = 0, message = "totalCopies must be >= 0")
    private Integer totalCopies;

    @NotNull(message = "availableCopies is required")
    @Min(value = 0, message = "availableCopies must be >= 0")
    private Integer availableCopies;

    private String description;

    @NotNull(message = "authorId is required")
    private Long authorId;

    @NotNull(message = "categoryId is required")
    private Long categoryId;

    // convenience fields in responses
    private String authorName;
    private String categoryName;
}

