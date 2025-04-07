package com.breadbolletguys.breadbread.order.presentation;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.order.application.OrderService;
import com.breadbolletguys.breadbread.order.domain.dto.request.IamportPayRequest;
import com.breadbolletguys.breadbread.order.domain.dto.request.OrderRequest;
import com.breadbolletguys.breadbread.order.domain.dto.request.PayRequest;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.vendingmachine.application.VendingMachineCacheService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;
    private final VendingMachineCacheService vendingMachineCacheService;

    @PostMapping(value = "/createOrder/{spaceId}",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Void> createOrder(
            @AuthUser User user,
            @PathVariable("spaceId") Long spaceId,
            @RequestPart("orderRequests") List<OrderRequest> orderRequests,
            @RequestPart("image") MultipartFile image
    ) {
        vendingMachineCacheService.deleteBySpaceId(spaceId);
        Long orderId = orderService.save(user, spaceId, orderRequests, image);
        vendingMachineCacheService.save(orderId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/vendor/{vendingMachineId}/{orderId}")
    public ResponseEntity<OrderResponse> getOrdersByIdAndVendingMachineId(
            @PathVariable("orderId") Long orderId,
            @PathVariable("vendingMachineId") Long vendingMachineId
    ) {
        return ResponseEntity.ok(orderService.getOrdersByIdAndVendingMachineId(orderId, vendingMachineId));
    }

    @PostMapping("/{orderId}/pay")
    public ResponseEntity<Void> payForOrder(
            @AuthUser User user,
            @PathVariable("orderId") Long orderId,
            @RequestBody PayRequest payRequest
    ) {
        vendingMachineCacheService.deleteByOrderId(orderId);
        orderService.payForOrder(user, orderId, payRequest.getAccountNo());
        vendingMachineCacheService.save(orderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{order}/pay/iamport")
    public ResponseEntity<Void> payOrderWithIamport(
            @AuthUser User user,
            @PathVariable("orderId") Long orderId,
            @RequestBody IamportPayRequest iamportPayRequest
    ) {
        orderService.payOrderWithIamport(user, orderId, iamportPayRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{orderId}/refund")
    public ResponseEntity<Void> refundOrder(
            @AuthUser User user,
            @PathVariable("orderId") Long orderId
    ) {
        vendingMachineCacheService.deleteByOrderId(orderId);
        orderService.refundOrder(user, orderId);
        vendingMachineCacheService.save(orderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{orderId}/pickup")
    public ResponseEntity<Void> pickupOrder(
            @AuthUser User user,
            @PathVariable("orderId") Long orderId
    ) {
        vendingMachineCacheService.deleteByOrderId(orderId);
        orderService.pickupOrder(user, orderId);
        vendingMachineCacheService.save(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/myOrder")
    public ResponseEntity<List<OrderResponse>> getOrdersByBuyerId(
            @AuthUser User user
    ) {
        return ResponseEntity.ok(orderService.getOrdersByBuyerId(user));
    }

    @GetMapping("/myStocks")
    public ResponseEntity<Page<OrderStackResponse>> getMyOrderStocks(
            @AuthUser User user,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.getMyOrderStocks(user, pageable));
    }

    @GetMapping("/mySoldout")
    public ResponseEntity<Page<OrderStackResponse>> getMyOrderSoldout(
            @AuthUser User user,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(orderService.getMyOrderSoldout(user, pageable));
    }

    @GetMapping("/{vendingMachineId}/seller")
    public ResponseEntity<List<OrderResponse>> getOrdersBySellerId(
            @AuthUser User user,
            @PathVariable("vendingMachineId") Long vendingMachineId
    ) {
        return ResponseEntity.ok(orderService.getOrdersBySellerId(user, vendingMachineId));
    }

}