package com.example.smartvendorapp.service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.smartvendorapp.dto.PageResponse;
import com.example.smartvendorapp.dto.ProductDto;
import com.example.smartvendorapp.entity.Category;
import com.example.smartvendorapp.entity.Product;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.entity.Vendor;
import com.example.smartvendorapp.enums.ProductStatus;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.VendorRepository;
import com.example.smartvendorapp.repository.CategoryRepository;
import com.example.smartvendorapp.repository.ReviewRepository;
import com.example.smartvendorapp.repository.WishlistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final WishlistRepository wishlistRepository;

    public PageResponse<ProductDto> getAllProducts(String category, ProductStatus status, String search, Pageable pageable) {
        return getAllProducts(category, status, search, pageable, null);
    }

    public PageResponse<ProductDto> getAllProducts(String category, ProductStatus status, String search, Pageable pageable, String customerEmail) {
        Page<Product> productsPage;
        
        if (search != null && !search.isEmpty()) {
            productsPage = productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else if (category != null && status != null) {
            productsPage = productRepository.findByCategory_NameAndStatus(category, status, pageable);
        } else if (status != null) {
            productsPage = productRepository.findByStatus(status, pageable);
        } else {
            productsPage = productRepository.findAll(pageable);
        }

        return mapToPageResponse(productsPage, customerEmail);
    }

    public ProductDto getProductById(UUID id) {
        return getProductById(id, null);
    }

    public ProductDto getProductById(UUID id, String customerEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToDto(product, customerEmail);
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

        Category cat = null;
        if (dto.getCategory() != null) {
            cat = categoryRepository.findByName(dto.getCategory())
                .orElseGet(() -> categoryRepository.save(Category.builder().name(dto.getCategory()).createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build()));
        }

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .category(cat)
                .imageUrl(dto.getImageUrl())
                .status(dto.getStatus() != null ? dto.getStatus() : ProductStatus.ACTIVE)
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
        if (dto.getCategory() != null) {
            Category cat = categoryRepository.findByName(dto.getCategory())
                .orElseGet(() -> categoryRepository.save(Category.builder().name(dto.getCategory()).createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build()));
            product.setCategory(cat);
        }
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
        return mapToDto(product, null);
    }

    private ProductDto mapToDto(Product product, String customerEmail) {
        Double avgRating = reviewRepository.getAverageRatingForProduct(product.getId());
        Long reviewCount = reviewRepository.getReviewCountForProduct(product.getId());

        boolean isWishlisted = false;
        if (customerEmail != null) {
            isWishlisted = userRepository.findByEmail(customerEmail)
                    .map(user -> wishlistRepository.existsByCustomerIdAndProductId(user.getId(), product.getId()))
                    .orElse(false);
        }

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .vendorId(product.getVendor() != null ? product.getVendor().getId() : null)
                .vendorName(product.getVendor() != null ? product.getVendor().getStoreName() : null)
                .rating(avgRating != null ? avgRating : 0.0)
                .reviews(reviewCount != null ? reviewCount : 0L)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .isWishlisted(isWishlisted)
                .build();
    }

    private PageResponse<ProductDto> mapToPageResponse(Page<Product> page) {
        return mapToPageResponse(page, null);
    }

    private PageResponse<ProductDto> mapToPageResponse(Page<Product> page, String customerEmail) {
        return PageResponse.<ProductDto>builder()
                .content(page.getContent().stream()
                        .map(p -> mapToDto(p, customerEmail))
                        .collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .page(page.getNumber())
                .size(page.getSize())
                .build();
    }
}
