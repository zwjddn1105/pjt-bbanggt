package com.breadbolletguys.breadbread.order.application;

import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.dto.request.OrderRequest;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public List<OrderResponse> getOrdersByVendingMachineId(Long vendingMachineId) {
        return orderRepository.findByVendingMachineId(vendingMachineId);
    }

    public OrderResponse getOrdersByIdAndVendingMachineId( Long id, Long vendingMachineId) {
        return orderRepository.findByIdAndVendingMachineId(id, vendingMachineId);
    }

    public void save(User user, Long spaceId, OrderRequest orderRequest) {
        Order order = Order.builder()
                .bakeryId(orderRequest.getBakeryId())
                .sellerId(user.getId())
                .spaceId(spaceId)
                .buyerId(null)
                .name(orderRequest.getName())
                .price(orderRequest.getPrice())
                .count(orderRequest.getCount())
                .expirationDate(orderRequest.getExpirationDate())
                .productState(ProductState.AVAILABLE)
                .breadType(orderRequest.getBreadType())
                .build();

        orderRepository.save(order);

    }
}
