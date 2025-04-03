package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepository {
    private final OrderJpaRepository orderJpaRepository;
    private final OrderQueryRepository orderQueryRepository;

    public List<OrderResponse> findByVendingMachineId(Long vendingMachineId) {
        return orderQueryRepository.findByVendingMachineId(vendingMachineId);
    }

    public List<OrderResponse> findByBuyerId(Long userId) {
        return orderQueryRepository.findByBuyerId(userId);
    }

    public OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId) {
        return orderQueryRepository.findByIdAndVendingMachineId(id, vendingMachineId);
    }

    public List<OrderStackResponse> findStocksBySellerId(Long userId) {
        return orderQueryRepository.findStocksBySellerId(userId);
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

    public List<Order> findAllById(Iterable<Long> ids) {
        return orderJpaRepository.findAllById(ids);
    }
}
