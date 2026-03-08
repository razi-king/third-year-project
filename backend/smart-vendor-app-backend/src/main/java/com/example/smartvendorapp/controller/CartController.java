package com.example.smartvendorapp.controller;

import java.util.Map;
import java.util.UUID;

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
    public ResponseEntity<CartDto> addItemToCart(@RequestBody Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID productId = UUID.fromString(payload.get("productId").toString());
        Integer quantity = Integer.parseInt(payload.get("quantity").toString());
        
        return ResponseEntity.ok(cartService.addItemToCart(auth.getName(), productId, quantity));
    }

    @PatchMapping("/items/{productId}")
    public ResponseEntity<CartDto> updateItemQuantity(
            @PathVariable UUID productId,
            @RequestBody Map<String, Integer> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Integer quantity = payload.get("quantity");
        
        return ResponseEntity.ok(cartService.updateItemQuantity(auth.getName(), productId, quantity));
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
