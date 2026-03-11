package com.example.smartvendorapp.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.smartvendorapp.entity.Order;
import com.example.smartvendorapp.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    Page<Order> findByCustomerId(UUID customerId, Pageable pageable);
    
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.vendor.id = :vendorId")
    Page<Order> findByVendorId(@Param("vendorId") UUID vendorId, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.vendor.id = :vendorId AND " +
           "(:status IS NULL OR o.status = :status)")
    Page<Order> findByVendorIdAndStatus(@Param("vendorId") UUID vendorId, @Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    Double getTotalRevenue();

    @Query("SELECT COALESCE(SUM(i.price * i.quantity), 0) FROM OrderItem i WHERE i.product.vendor.id = :vendorId AND i.order.status != 'CANCELLED'")
    Double getTotalRevenueForVendor(@Param("vendorId") UUID vendorId);
}
