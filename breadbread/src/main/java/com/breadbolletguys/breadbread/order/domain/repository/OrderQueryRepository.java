package com.breadbolletguys.breadbread.order.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;

public interface OrderQueryRepository {
    List<OrderResponse> findByVendingMachineId(Long vendingMachineId);

    List<OrderResponse> findByBuyerId(Long userId);

    List<OrderStackResponse> findStocksBySellerId(Long userId);

    OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId);

    List<Order> findAllByExpirationDateBefore();

    List<Order> findAvailableOrdersBySpaceIds(List<Long> spaceIds);
}
