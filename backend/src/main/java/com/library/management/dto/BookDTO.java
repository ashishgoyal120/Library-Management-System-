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

    @NotBlank(message = "Title is required")
    private String title;

    private String isbn;
    private String publisher;
    private Integer publicationYear;

    @NotNull(message = "Total copies is required")
    @Min(value = 0, message = "Total copies cannot be negative")
    private Integer totalCopies;

    @NotNull(message = "Available copies is required")
    @Min(value = 0, message = "Available copies cannot be negative")
    private Integer availableCopies;

    private String description;

    @NotNull(message = "Author is required")
    private Long authorId;

    @NotNull(message = "Category is required")
    private Long categoryId;

    // convenience fields in responses
    private String authorName;
    private String categoryName;
}
