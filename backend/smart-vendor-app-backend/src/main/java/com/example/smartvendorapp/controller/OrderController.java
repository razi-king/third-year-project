package com.example.smartvendorapp.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.example.smartvendorapp.dto.OrderDto;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.dto.PageResponse;
import com.example.smartvendorapp.enums.OrderStatus;
import com.example.smartvendorapp.service.OrderService;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OrderDto>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(orderService.getAllOrders(status, pageable));
    }

    @GetMapping("/orders/my")
    public ResponseEntity<PageResponse<OrderDto>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }

        User customer = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customer.getId(), pageable));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody OrderDto orderDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(orderService.createOrder(orderDto, auth.getName()));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {
        OrderStatus status = OrderStatus.valueOf(payload.get("status").toUpperCase());
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @PatchMapping("/orders/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        orderService.cancelOrder(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customers/{customerId}/orders")
    public ResponseEntity<PageResponse<OrderDto>> getOrdersByCustomer(
            @PathVariable UUID customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId, pageable));
    }

    @GetMapping("/vendors/{vendorId}/orders")
    public ResponseEntity<PageResponse<OrderDto>> getOrdersByVendor(
            @PathVariable UUID vendorId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(orderService.getOrdersByVendor(vendorId, status, pageable));
    }

    @PutMapping("/vendor/orders/{orderId}/status")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<OrderDto> updateVendorOrderStatus(
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> payload) {
        OrderStatus status = OrderStatus.valueOf(payload.get("status").toUpperCase());
        return ResponseEntity.ok(orderService.updateVendorOrderStatus(orderId, status, SecurityContextHolder.getContext().getAuthentication().getName()));
    }
}
