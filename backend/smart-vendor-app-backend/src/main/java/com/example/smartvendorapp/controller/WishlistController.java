package com.example.smartvendorapp.controller;

import com.example.smartvendorapp.dto.WishlistDto;
import com.example.smartvendorapp.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistDto>> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(wishlistService.getCustomerWishlist(userDetails.getUsername()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistDto> addToWishlist(
            @PathVariable ("productId") UUID productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(wishlistService.addToWishlist(productId, userDetails.getUsername()));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @PathVariable ("productId") UUID productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        wishlistService.removeFromWishlist(productId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Removed successfully"));
    }
}
