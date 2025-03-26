package com.breadbolletguys.breadbread.order.presentation;

import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.order.application.OrderService;
import com.breadbolletguys.breadbread.order.domain.dto.request.OrderRequest;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SpaceResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/order")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/createOrder/{spaceId}")
    public ResponseEntity<Void> createOrder(
            @AuthUser User user,
            @PathVariable("spaceId") Long spaceId,
            @RequestBody List<OrderRequest> orderRequests) {
        orderService.save(user, spaceId, orderRequests);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vendor/{vendingMachineId}")
    public ResponseEntity<List<SpaceResponse>> getOrdersByVendingMachineId(
            @PathVariable("vendingMachineId") Long vendingMachineId
    ) {
        return ResponseEntity.ok(orderService.getOrdersByVendingMachineId(vendingMachineId));
    }

    @GetMapping("/vendor/{vendingMachineId}/{id}")
    public ResponseEntity<OrderResponse> getOrdersByIdAndVendingMachineId(
            @PathVariable("id") Long id,
            @PathVariable("vendingMachineId") Long vendingMachineId
    ) {
        return ResponseEntity.ok(orderService.getOrdersByIdAndVendingMachineId(id, vendingMachineId));
    }

    @PostMapping("/reserve/{orderId}")
    public ResponseEntity<Void> reserveOrder(
            @AuthUser User user,
            @PathVariable("orderId") Long orderId
    ) {
        orderService.selectOrder(user, orderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pay/{orderId}")
    public ResponseEntity<Void> payForOrder(
            @AuthUser User user,
            @PathVariable("orderId") Long orderId
    ) {
        orderService.payForOrder(user, orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/myOrder")
    public ResponseEntity<List<OrderResponse>> getOrdersByBuyerId(
            @AuthUser User user
    ) {
        return ResponseEntity.ok(orderService.getOrdersByBuyerId(user));
    }
}
