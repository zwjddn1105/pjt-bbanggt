package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;

public interface OrderQueryRepository {
    List<OrderResponse> findByVendingMachineId(Long vendingMachineId);

    OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId);
}
