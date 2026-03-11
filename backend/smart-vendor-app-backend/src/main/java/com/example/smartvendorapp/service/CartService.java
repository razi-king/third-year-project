package com.example.smartvendorapp.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.smartvendorapp.dto.CartDto;
import com.example.smartvendorapp.dto.CartItemDto;
import com.example.smartvendorapp.entity.Cart;
import com.example.smartvendorapp.entity.CartItem;
import com.example.smartvendorapp.entity.Product;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.exception.ValidationException;
import com.example.smartvendorapp.repository.CartRepository;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDto getCart(String customerEmail) {
        Cart cart = getCartEntity(customerEmail);
        return mapToDto(cart);
    }

    public CartDto addItemToCart(String customerEmail, UUID productId, Integer quantity) {
        Cart cart = getCartEntity(customerEmail);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        int totalRequested = quantity;
        if (existingItem.isPresent()) {
            totalRequested += existingItem.get().getQuantity();
        }

        if (product.getStock() < totalRequested) {
            throw new ValidationException("Insufficient stock. Only " + product.getStock() + " items available.");
        }

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setPrice(product.getPrice());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .price(product.getPrice())
                    .build();
            cart.getItems().add(newItem);
        }

        updateCartTotal(cart);
        return mapToDto(cartRepository.save(cart));
    }

    public CartDto updateItemQuantity(String customerEmail, UUID productId, Integer quantity) {
        Cart cart = getCartEntity(customerEmail);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart"));

        if (quantity > item.getProduct().getStock()) {
            throw new ValidationException("Insufficient stock. Only " + item.getProduct().getStock() + " items available.");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }

        updateCartTotal(cart);
        return mapToDto(cartRepository.save(cart));
    }

    public CartDto removeItemFromCart(String customerEmail, UUID productId) {
        Cart cart = getCartEntity(customerEmail);

        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        
        updateCartTotal(cart);
        return mapToDto(cartRepository.save(cart));
    }

    public void clearCart(String customerEmail) {
        Cart cart = getCartEntity(customerEmail);
        cart.getItems().clear();
        cart.setTotalAmount(0.0);
        cartRepository.save(cart);
    }

    private Cart getCartEntity(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        return cartRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .customer(customer)
                            .totalAmount(0.0)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private void updateCartTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        cart.setTotalAmount(total);
    }

    private CartDto mapToDto(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems().stream()
                .map(item -> CartItemDto.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .imageUrl(item.getProduct().getImageUrl())
                        .build())
                .collect(Collectors.toList());

        return CartDto.builder()
                .id(cart.getId())
                .items(itemDtos)
                .totalAmount(cart.getTotalAmount())
                .build();
    }
}
