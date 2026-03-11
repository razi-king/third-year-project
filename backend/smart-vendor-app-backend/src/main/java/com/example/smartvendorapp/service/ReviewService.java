package com.example.smartvendorapp.service;

import com.example.smartvendorapp.dto.ReviewDto;
import com.example.smartvendorapp.entity.Order;
import com.example.smartvendorapp.entity.OrderItem;
import com.example.smartvendorapp.entity.Product;
import com.example.smartvendorapp.entity.Review;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.enums.Role;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.repository.OrderRepository;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.ReviewRepository;
import com.example.smartvendorapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public ReviewDto addReview(UUID productId, ReviewDto reviewDto, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new IllegalArgumentException("Only customers can leave reviews");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Optional: verify if customer actually bought the product
        boolean hasPurchased = orderRepository.findByCustomerId(customer.getId(), org.springframework.data.domain.Pageable.unpaged())
                .getContent().stream()
                .flatMap(order -> order.getItems().stream())
                .anyMatch(item -> item.getProduct().getId().equals(productId));

        if (!hasPurchased) {
            throw new IllegalArgumentException("You can only review products you have purchased.");
        }

        if (reviewDto.getRating() == null || reviewDto.getRating() < 1 || reviewDto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        Review review = Review.builder()
                .product(product)
                .customer(customer)
                .rating(reviewDto.getRating())
                .comment(reviewDto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        return mapToDto(reviewRepository.save(review));
    }

    public List<ReviewDto> getReviewsByProduct(UUID productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReviewDto> getReviewsByCustomer(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return reviewRepository.findByCustomerId(customer.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public List<ReviewDto> getReviewsByVendorProduct(UUID vendorId) {
        return reviewRepository.findByProductVendorId(vendorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
