package com.library.management.controller;

import com.library.management.dto.BorrowRecordDTO;
import com.library.management.dto.BorrowRequestDTO;
import com.library.management.service.BorrowService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/issue")
    public ResponseEntity<BorrowRecordDTO> issue(@Valid @RequestBody BorrowRequestDTO req) {
        BorrowRecordDTO created = borrowService.issueBook(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<BorrowRecordDTO> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<BorrowRecordDTO>> active() {
        return ResponseEntity.ok(borrowService.getActiveBorrows());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowRecordDTO>> overdue() {
        return ResponseEntity.ok(borrowService.getOverdue());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowRecordDTO>> userHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowService.getUserHistory(userId));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BorrowRecordDTO>> bookHistory(@PathVariable Long bookId) {
        return ResponseEntity.ok(borrowService.getBookHistory(bookId));
    }
}

