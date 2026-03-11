package com.example.smartvendorapp.controller;

import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartvendorapp.dto.PageResponse;
import com.example.smartvendorapp.dto.ProductDto;
import com.example.smartvendorapp.enums.ProductStatus;
import com.example.smartvendorapp.service.ProductService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<PageResponse<ProductDto>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserDetails userDetails) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        String customerEmail = userDetails != null ? userDetails.getUsername() : null;

        return ResponseEntity.ok(productService.getAllProducts(category, status, search, pageable, customerEmail));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDto> getProductById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String customerEmail = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(productService.getProductById(id, customerEmail));
    }

    @GetMapping("/vendors/{vendorId}/products")
    public ResponseEntity<PageResponse<ProductDto>> getProductsByVendor(
            @PathVariable UUID vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(productService.getProductsByVendor(vendorId, pageable));
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ProductDto> createProduct(@Validated @RequestBody ProductDto productDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.createProduct(productDto, auth.getName()));
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductDto productDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(productService.updateProduct(id, productDto, auth.getName()));
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
