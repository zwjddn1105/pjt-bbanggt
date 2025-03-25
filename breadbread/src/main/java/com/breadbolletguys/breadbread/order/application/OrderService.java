package com.breadbolletguys.breadbread.order.application;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.dto.request.OrderRequest;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.transaction.domain.Transaction;
import com.breadbolletguys.breadbread.transaction.domain.repository.TransactionJpaRepository;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final TransactionJpaRepository transactionJpaRepository;

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByVendingMachineId(Long vendingMachineId) {
        return orderRepository.findByVendingMachineId(vendingMachineId);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrdersByIdAndVendingMachineId( Long id, Long vendingMachineId) {
        return orderRepository.findByIdAndVendingMachineId(id, vendingMachineId);
    }

    @Transactional
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

    @Transactional
    public void selectOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getProductState().equals(ProductState.AVAILABLE)) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_RESERVE_PRODUCT);
        }
        order.setBuyerId(user.getId());
        order.setProductState(ProductState.RESERVED);
    }

    @Transactional
    public void payForOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getBuyerId().equals(user.getId())) {
            throw new BadRequestException(ErrorCode.FORBIDDEN_ORDER_ACCESS);
        }

        if (!order.getProductState().equals(ProductState.RESERVED)) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_PURCHASE_PRODUCT);
        }
        order.setProductState(ProductState.SOLD_OUT);
    }

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void expireOutdatedOrders() {
        List<Order> orders = orderRepository.findAllByExpirationDateAfter();
        for (Order order : orders) {
            order.setProductState(ProductState.EXPIRED);
        }
    }
}
