package com.library.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalBooksCount;
    private long availableBooksCount;
    private long borrowedBooksCount;
    private long totalMembersCount;
    private long overdueBooksCount;
}

