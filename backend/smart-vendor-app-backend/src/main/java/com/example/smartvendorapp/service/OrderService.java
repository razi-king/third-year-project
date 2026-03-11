package com.example.smartvendorapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.smartvendorapp.dto.OrderDto;
import com.example.smartvendorapp.dto.OrderItemDto;
import com.example.smartvendorapp.dto.PageResponse;
import com.example.smartvendorapp.entity.Order;
import com.example.smartvendorapp.entity.OrderItem;
import com.example.smartvendorapp.entity.Product;
import com.example.smartvendorapp.entity.User;
import com.example.smartvendorapp.enums.OrderStatus;
import com.example.smartvendorapp.enums.Role;
import com.example.smartvendorapp.exception.ResourceNotFoundException;
import com.example.smartvendorapp.repository.OrderRepository;
import com.example.smartvendorapp.repository.ProductRepository;
import com.example.smartvendorapp.repository.UserRepository;
import com.example.smartvendorapp.repository.VendorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final CartService cartService;

    public PageResponse<OrderDto> getAllOrders(OrderStatus status, Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable); // Should add status filter if needed in repo
        return mapToPageResponse(orders);
    }

    public OrderDto getOrderById(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToDto(order);
    }

    public PageResponse<OrderDto> getOrdersByCustomer(UUID customerId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByCustomerId(customerId, pageable);
        return mapToPageResponse(orders);
    }

    public PageResponse<OrderDto> getOrdersByVendor(UUID vendorId, OrderStatus status, Pageable pageable) {
        Page<Order> orders;
        if (status != null) {
            orders = orderRepository.findByVendorIdAndStatus(vendorId, status, pageable);
        } else {
            orders = orderRepository.findByVendorId(vendorId, pageable);
        }
        return mapToPageResponse(orders);
    }

    @Transactional
    public OrderDto createOrder(OrderDto orderDto, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new IllegalArgumentException("Only customers can create orders");
        }

        Order order = Order.builder()
                .customer(customer)
                .status(OrderStatus.PENDING)
                .shippingAddress(orderDto.getShippingAddress())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        double totalAmount = 0;

        for (OrderItemDto itemDto : orderDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }

            // Reduce stock
            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .price(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount += (product.getPrice() * itemDto.getQuantity());
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);
        
        // Clear customer cart after successful order creation
        cartService.clearCart(customerEmail);
        
        return mapToDto(order);
    }

    public OrderDto updateOrderStatus(UUID id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        return mapToDto(orderRepository.save(order));
    }

    public OrderDto updateVendorOrderStatus(UUID orderId, OrderStatus newStatus, String vendorEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Verify vendor owns at least one product in this order
        com.example.smartvendorapp.entity.User vendorUser = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor user not found"));
        com.example.smartvendorapp.entity.Vendor vendor = vendorRepository.findByUserId(vendorUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));

        boolean ownsProduct = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getVendor() != null
                        && item.getProduct().getVendor().getId().equals(vendor.getId()));
        if (!ownsProduct) {
            throw new IllegalArgumentException("You do not have permission to update this order");
        }

        // Enforce valid forward-only status transitions
        OrderStatus current = order.getStatus();
        boolean validTransition = switch (current) {
            case PENDING   -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
            case CONFIRMED -> newStatus == OrderStatus.SHIPPED   || newStatus == OrderStatus.CANCELLED;
            case SHIPPED   -> newStatus == OrderStatus.DELIVERED;
            default        -> false;  // DELIVERED and CANCELLED are terminal — no further transitions
        };

        if (!validTransition) {
            String allowed = switch (current) {
                case PENDING   -> "CONFIRMED or CANCELLED";
                case CONFIRMED -> "SHIPPED or CANCELLED";
                case SHIPPED   -> "DELIVERED";
                default        -> "none (terminal status)";
            };
            throw new IllegalArgumentException(
                    "Invalid transition: " + current + " → " + newStatus
                    + ". Allowed next statuses from " + current + ": " + allowed);
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());

        return mapToDto(orderRepository.save(order));
    }

    public void cancelOrder(UUID id, String customerEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getCustomer().getEmail().equals(customerEmail)) {
            throw new IllegalArgumentException("Unauthorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("Order cannot be cancelled in current status");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        orderRepository.save(order);
    }

    private OrderDto mapToDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> OrderItemDto.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemDtos)
                .build();
    }

    private PageResponse<OrderDto> mapToPageResponse(Page<Order> page) {
        return PageResponse.<OrderDto>builder()
                .content(page.getContent().stream().map(this::mapToDto).collect(Collectors.toList()))
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .page(page.getNumber())
                .size(page.getSize())
                .build();
    }
}
