package com.example.smartvendorapp.controller;

import java.util.UUID;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartvendorapp.dto.CartDto;
import com.example.smartvendorapp.dto.CartItemRequest;
import com.example.smartvendorapp.dto.UpdateCartItemRequest;
import com.example.smartvendorapp.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(cartService.addItemToCart(auth.getName(), request.getProductId(), request.getQuantity()));
    }

    @PatchMapping("/items/{productId}")
    public ResponseEntity<CartDto> updateItemQuantity(
            @PathVariable UUID productId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(cartService.updateItemQuantity(auth.getName(), productId, request.getQuantity()));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartDto> removeItemFromCart(@PathVariable UUID productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(cartService.removeItemFromCart(auth.getName(), productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        cartService.clearCart(auth.getName());
        return ResponseEntity.noContent().build();
    }
}
