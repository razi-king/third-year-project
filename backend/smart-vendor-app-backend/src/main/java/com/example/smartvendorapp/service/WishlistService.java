package com.example.smartvendorapp.service;

import com.example.smartvendorapp.dto.WishlistDto;
import com.example.smartvendorapp.entity.Product;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.entity.Wishlist;
import com.example.smartvendorapp.enums.Role;
import com.example.smartvendorapp.exception.DuplicateResourceException;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<WishlistDto> getCustomerWishlist(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return wishlistRepository.findByCustomerId(customer.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistDto addToWishlist(UUID productId, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new IllegalArgumentException("Only customers can use the wishlist");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (wishlistRepository.existsByCustomerIdAndProductId(customer.getId(), product.getId())) {
            throw new DuplicateResourceException("Product is already in the wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .customer(customer)
                .product(product)
                .createdAt(LocalDateTime.now())
                .build();

        return mapToDto(wishlistRepository.save(wishlist));
    }

    @Transactional
    public void removeFromWishlist(UUID productId, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Wishlist wishlist = wishlistRepository.findByCustomerIdAndProductId(customer.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in your wishlist"));

        wishlistRepository.delete(wishlist);
    }

    private WishlistDto mapToDto(Wishlist wishlist) {
        return WishlistDto.builder()
                .id(wishlist.getId())
                .productId(wishlist.getProduct().getId())
                .productName(wishlist.getProduct().getName())
                .price(wishlist.getProduct().getPrice())
                .imageUrl(wishlist.getProduct().getImageUrl())
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}
