package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderCountQueryResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;
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

    public PageInfo<OrderStackResponse> findStocksBySellerId(Long userId, String pageToken) {
        var data = orderQueryRepository.findStocksBySellerId(userId, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, OrderStackResponse::getId);
    }

    public PageInfo<OrderStackResponse> findSoldoutBySellerId(Long userId, String pageToken) {
        var data = orderQueryRepository.findSoldoutBySellerId(userId, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, OrderStackResponse::getId);
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
}
