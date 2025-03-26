package com.breadbolletguys.breadbread.order.application;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderSummaryResponse;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.transaction.domain.Transaction;
import com.breadbolletguys.breadbread.transaction.domain.repository.TransactionJpaRepository;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.vendingmachine.domain.Space;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SpaceResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.SpaceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final SpaceRepository spaceRepository;
    private final TransactionJpaRepository transactionJpaRepository;

    @Transactional(readOnly = true)
    public List<SpaceResponse> getOrdersByVendingMachineId(Long vendingMachineId) {
        List<Space> spaces = spaceRepository.findByVendingMachineId(vendingMachineId);
        int maxWidth = getWidth(spaces) + 1;
        Map<Long, Order> orderMap = orderRepository.findAvailableOrdersBySpaceIds(
                spaces.stream().map(Space::getId).toList()
        ).stream().collect(Collectors.toMap(Order::getSpaceId, o -> o));

        List<SpaceResponse> spaceResponses = new ArrayList<>();
        for (Space space : spaces) {
            Order order = orderMap.get(space.getId());
            if (order == null) {
                spaceResponses.add(new SpaceResponse(space.getId(), null));
                continue;
            }
            OrderSummaryResponse summaryResponse = new OrderSummaryResponse(
                    order.getId(),
                    (space.getHeight() * maxWidth) + space.getWidth() + 1,
                    List.of(order.getBreadType())
            );
            spaceResponses.add(new SpaceResponse(space.getId(), summaryResponse));
        }
        return spaceResponses;
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrdersByIdAndVendingMachineId( Long id, Long vendingMachineId) {
        return orderRepository.findByIdAndVendingMachineId(id, vendingMachineId);
    }

    @Transactional
    public void save(User user, Long spaceId, List<OrderRequest> orderRequests) {
        List<Order> orders = new ArrayList<>();
        for (OrderRequest orderRequest : orderRequests) {
            LocalDateTime expirationDate = LocalDateTime.now()
                    .plusDays(1)
                    .withHour(10)
                    .withMinute(0)
                    .withSecond(0)
                    .withNano(0);

            Order order = Order.builder()
                    .bakeryId(orderRequest.getBakeryId())
                    .sellerId(user.getId())
                    .spaceId(spaceId)
                    .buyerId(null)
                    .name(orderRequest.getName())
                    .price(orderRequest.getPrice() * orderRequest.getDiscount() / 100)
                    .count(orderRequest.getCount())
                    .expirationDate(expirationDate)
                    .productState(ProductState.AVAILABLE)
                    .breadType(orderRequest.getBreadType())
                    .build();
            orders.add(order);
        }
        orderRepository.saveAll(orders);
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

    @Scheduled(cron = "0 10 10 * * *")
    @Transactional
    public void expireOutdatedOrders() {
        List<Order> orders = orderRepository.findAllByExpirationDateBefore();
        for (Order order : orders) {
            order.setProductState(ProductState.EXPIRED);
        }
    }

    private int getWidth(List<Space> spaces) {
        return spaces.stream()
                .mapToInt(Space::getWidth)
                .max()
                .orElse(0);
    }
}
