package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderCountQueryResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepository {
    private final OrderJpaRepository orderJpaRepository;
    private final OrderQueryRepository orderQueryRepository;

    public List<OrderResponse> findByBuyerId(Long userId) {
        return orderQueryRepository.findByBuyerId(userId);
    }

    public List<OrderResponse> findBySellerId(Long userId, Long vendingMachineId) {
        return orderQueryRepository.findBySellerId(userId, vendingMachineId);
    }

    public OrderResponse findByIdAndVendingMachineId(Long orderId, Long vendingMachineId) {
        return orderQueryRepository.findByIdAndVendingMachineId(orderId, vendingMachineId);
    }

    public Page<OrderStackResponse> findStocksBySellerId(Long userId, Pageable pageable) {
        return orderQueryRepository.findStocksBySellerId(userId, pageable);
    }

    public Page<OrderStackResponse> findSoldoutBySellerId(Long userId, Pageable pageable) {
        return orderQueryRepository.findSoldoutBySellerId(userId, pageable);
    }

    public Order save(Order order) {
        return orderJpaRepository.save(order);
    }

    public Optional<Order> findById(Long orderId) {
        return orderJpaRepository.findById(orderId);
    }

    public int countAvailableOrderByVendingMachineId(Long vendingMachineId) {
        return orderQueryRepository.countAvailableOrderByVendingMachineId(vendingMachineId);
    }

    public List<OrderCountQueryResponse> findAvailableCountsByVendingMachineIds(List<Long> vendingMachineIds) {
        return orderQueryRepository.findAvailableCountsByVendingMachineIds(vendingMachineIds);
    }

    public List<Order> findAllById(List<Long> ids) {
        return orderJpaRepository.findAllByIdIn(ids);
    }

    public List<Long> findSpaceIdsByBakeryIds(List<Long> bakeryIds) {
        return orderJpaRepository.findSpaceIdsByBakeryIds(bakeryIds);
    }

    public Optional<Order> findBySpaceIdAndProductState(Long spaceId, ProductState productState) {
        return orderJpaRepository.findBySpaceIdAndProductState(spaceId, productState);
    }

    public Optional<Order> findFirstBySpaceIdAndProductStateIn(
            Long spaceId,
            List<ProductState> productStates
    ) {
        return orderJpaRepository.findFirstBySpaceIdAndProductStateIn(spaceId, productStates);
    }

    public List<OrderResponse> findMyNFT(Long userId) {
        return orderQueryRepository.findMyNFT(userId);
    }
}