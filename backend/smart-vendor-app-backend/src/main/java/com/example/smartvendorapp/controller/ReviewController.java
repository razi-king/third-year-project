package com.example.smartvendorapp.controller;

import com.example.smartvendorapp.dto.ReviewDto;
import com.example.smartvendorapp.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/product/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewDto> addReview(
            @PathVariable ("productId") UUID productId,
            @Valid @RequestBody ReviewDto reviewDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        return ResponseEntity.ok(reviewService.addReview(productId, reviewDto, userDetails.getUsername()));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getProductReviews(@PathVariable ("productId") UUID productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReviewDto>> getCustomerReviews(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getReviewsByCustomer(userDetails.getUsername()));
    }
}
