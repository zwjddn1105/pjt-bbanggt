package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderCountQueryResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;

public interface OrderQueryRepository {

    List<OrderResponse> findByBuyerId(Long userId);

    List<OrderResponse> findBySellerId(Long userId, Long vendingMachineId);

    Page<OrderStackResponse> findStocksBySellerId(Long userId, Pageable pageable);

    Page<OrderStackResponse> findSoldoutBySellerId(Long userId, Pageable pageable);

    OrderResponse findByIdAndVendingMachineId(Long orderId, Long vendingMachineId);

    Integer countAvailableOrderByVendingMachineId(Long vendingMachineId);

    List<OrderCountQueryResponse> findAvailableCountsByVendingMachineIds(List<Long> vendingMachineIds);

    List<OrderResponse> findMyNFT(Long userId);
}