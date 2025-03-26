package com.breadbolletguys.breadbread.order.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;

public interface OrderQueryRepository {
    List<OrderResponse> findByVendingMachineId(Long vendingMachineId);

    OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId);

    List<Order> findAllByExpirationDateBefore();

    List<Order> findAvailableOrdersBySpaceIds(List<Long> spaceIds);
}
