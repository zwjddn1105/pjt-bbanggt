package com.breadbolletguys.breadbread.order.application;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.order.domain.BreadType;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.dto.request.OrderRequest;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderSummaryResponse;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountTransferRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.service.SsafyTransferService;
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
    @Value("${app.admin.userId}")
    private String adminId;

    @Value("{app.admin.userKey}")
    private String adminKey;

    @Value("{app.admin.account}")
    private String adminAccount;

    private final BakeryRepository bakeryRepository;
    private final OrderRepository orderRepository;
    private final SpaceRepository spaceRepository;
    private final SsafyTransferService ssafyTransferService;

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
    public List<OrderResponse> getOrdersByBuyerId(User user) {
        return orderRepository.findByBuyerId(user.getId());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrdersByIdAndVendingMachineId(Long id, Long vendingMachineId) {
        return orderRepository.findByIdAndVendingMachineId(id, vendingMachineId);
    }

    @Transactional(readOnly = true)
    public List<OrderStackResponse> getMyOrderStocks(User user) {
        return orderRepository.findStocksBySellerId(user.getId());
    }

    @Transactional
    public void save(User user, Long spaceId, List<OrderRequest> orderRequests, MultipartFile image) {
        Long bakeryId = bakeryRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.BAKERY_NOT_FOUND))
                .getId();

        if (orderRequests.size() == 1) {
            saveSingleBreadOrder(user, spaceId, bakeryId, orderRequests.get(0), image);
        } else {
            saveMixedBreadOrder(user, spaceId, bakeryId, orderRequests, image);
        }
    }

    public void payForOrder(User user, Long orderId, String accountNo) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getProductState().equals(ProductState.AVAILABLE)) {
            throw new BadRequestException(ErrorCode.FORBIDDEN_ORDER_ACCESS);
        }
        order.setBuyerId(user.getId());
        order.setProductState(ProductState.SOLD_OUT);
        int discountPrice = (int) (order.getPrice() * order.getDiscount());

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                user.getUserKey(),
                accountNo,
                adminAccount,
                "입금",
                (long) discountPrice,
                accountNo,
                "출금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
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

    private void saveSingleBreadOrder(
            User user,
            Long spaceId,
            Long bakeryId,
            OrderRequest request,
            MultipartFile image) {
        LocalDateTime expirationDate = getExpirationDate();

        Order order = Order.builder()
                .bakeryId(bakeryId)
                .sellerId(user.getId())
                .spaceId(spaceId)
                .buyerId(null)
                .price(request.getPrice())
                .discount(request.getDiscount() * 1.0 / 100)
                .count(request.getCount())
                .image(null) // 이미지 업로드 시 로직 필요
                .expirationDate(expirationDate)
                .productState(ProductState.AVAILABLE)
                .breadType(request.getBreadType())
                .build();

        orderRepository.save(order);
    }

    private void saveMixedBreadOrder(User user,
                                     Long spaceId,
                                     Long bakeryId,
                                     List<OrderRequest> requests,
                                     MultipartFile image) {
        LocalDateTime expirationDate = getExpirationDate();

        int totalOriginalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalCount = 0;

        for (OrderRequest req : requests) {
            double rate = req.getDiscount() * 1.0 / 100;
            int originalPrice = req.getPrice();
            int discountPrice = (int) (req.getPrice() * (1 - rate));
            totalOriginalPrice += originalPrice;
            totalDiscountedPrice += discountPrice;
            totalCount += req.getCount();
        }

        double totalDiscountRate = (totalOriginalPrice - totalDiscountedPrice) / (double) totalOriginalPrice;

        Order mixedOrder = Order.builder()
                .bakeryId(bakeryId)
                .sellerId(user.getId())
                .spaceId(spaceId)
                .buyerId(null)
                .price(totalOriginalPrice)
                .discount(totalDiscountRate)
                .count(totalCount)
                .image(null) // 이미지 업로드 시 로직 필요
                .expirationDate(expirationDate)
                .productState(ProductState.AVAILABLE)
                .breadType(BreadType.MIXED_BREAD)
                .build();

        orderRepository.save(mixedOrder);
    }

    private LocalDateTime getExpirationDate() {
        return LocalDateTime.now()
                .plusDays(1)
                .withHour(10)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
    }
}
