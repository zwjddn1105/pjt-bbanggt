package com.breadbolletguys.breadbread.order.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepository {
    private final OrderJpaRepository orderJpaRepository;
    private final OrderQueryRepository orderQueryRepository;

    public List<OrderResponse> findByVendingMachineId(Long vendingMachineId) {
        return orderQueryRepository.findByVendingMachineId(vendingMachineId);
    }

    public OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId) {
        return orderQueryRepository.findByIdAndVendingMachineId(id, vendingMachineId);
    }

    public void saveAll(List<Order> orders) {
        orderJpaRepository.saveAll(orders);
    }

    public void save(Order order) {
        orderJpaRepository.save(order);
    }

    public Optional<Order> findById(Long orderId) {
        return orderJpaRepository.findById(orderId);
    }

    public List<Order> findAllByExpirationDateBefore() {
        return orderQueryRepository.findAllByExpirationDateBefore();
    }

    public List<Order> findAvailableOrdersBySpaceIds(List<Long> spaceIds) {
        return orderQueryRepository.findAvailableOrdersBySpaceIds(spaceIds);
    }
}
