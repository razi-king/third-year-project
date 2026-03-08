package com.example.smartvendorapp.service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.smartvendorapp.dto.PageResponse;
import com.example.smartvendorapp.dto.ProductDto;
import com.example.smartvendorapp.entity.Product;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.entity.Vendor;
import com.example.smartvendorapp.enums.ProductStatus;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.VendorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    public PageResponse<ProductDto> getAllProducts(String category, ProductStatus status, String search, Pageable pageable) {
        Page<Product> productsPage;
        
        if (search != null && !search.isEmpty()) {
            productsPage = productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else if (category != null && status != null) {
            productsPage = productRepository.findByCategoryAndStatus(category, status, pageable);
        } else if (status != null) {
            productsPage = productRepository.findByStatus(status, pageable);
        } else {
            productsPage = productRepository.findAll(pageable);
        }

        return mapToPageResponse(productsPage);
    }

    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToDto(product);
    }

    public PageResponse<ProductDto> getProductsByVendor(UUID vendorId, Pageable pageable) {
        Page<Product> productsPage = productRepository.findByVendorId(vendorId, pageable);
        return mapToPageResponse(productsPage);
    }

    public ProductDto createProduct(ProductDto dto, String vendorEmail) {
        User user = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .status(ProductStatus.ACTIVE)
                .vendor(vendor)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToDto(productRepository.save(product));
    }

    public ProductDto updateProduct(UUID id, ProductDto dto, String vendorEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Verify vendor ownership...
        
        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());
        
        product.setUpdatedAt(LocalDateTime.now());

        return mapToDto(productRepository.save(product));
    }

    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .vendorId(product.getVendor() != null ? product.getVendor().getId() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private PageResponse<ProductDto> mapToPageResponse(Page<Product> page) {
        return PageResponse.<ProductDto>builder()
                .content(page.getContent().stream().map(this::mapToDto).collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .page(page.getNumber())
                .size(page.getSize())
                .build();
    }
}
