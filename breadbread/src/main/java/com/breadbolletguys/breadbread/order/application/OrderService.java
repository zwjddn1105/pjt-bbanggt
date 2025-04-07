package com.breadbolletguys.breadbread.order.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.account.domain.Account;
import com.breadbolletguys.breadbread.account.domain.repository.AccountRepository;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.image.application.IpfsService;
import com.breadbolletguys.breadbread.image.application.S3Service;
import com.breadbolletguys.breadbread.order.domain.BreadType;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.dto.request.IamportPayRequest;
import com.breadbolletguys.breadbread.order.domain.dto.request.OrderRequest;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.order.infrasture.PaymentValidator;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountTransferRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.service.SsafyTransferService;
import com.breadbolletguys.breadbread.transaction.application.TransactionService;
import com.breadbolletguys.breadbread.transaction.domain.Transaction;
import com.breadbolletguys.breadbread.transaction.domain.TransactionStatus;
import com.breadbolletguys.breadbread.transaction.domain.TransactionType;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.repository.UserRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.Space;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.SpaceRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.VendingMachineRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    @Value("${app.admin.userId}")
    private String adminId;

    @Value("${app.admin.userKey}")
    private String adminKey;

    @Value("${app.admin.account}")
    private String adminAccount;

    private final AccountRepository accountRepository;
    private final BakeryRepository bakeryRepository;
    private final OrderRepository orderRepository;
    private final SpaceRepository spaceRepository;
    private final UserRepository userRepository;
    private final SsafyTransferService ssafyTransferService;
    private final TransactionService transactionService;
    private final S3Service s3Service;
    private final IpfsService ipfsService;
    private final VendingMachineRepository vendingMachineRepository;
    private final PaymentValidator paymentValidator;

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByBuyerId(User user) {
        return orderRepository.findByBuyerId(user.getId());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersBySellerId(User user, Long vendingMachineId) {
        return orderRepository.findBySellerId(user.getId(), vendingMachineId);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrdersByIdAndVendingMachineId(Long orderId, Long vendingMachineId) {
        return orderRepository.findByIdAndVendingMachineId(orderId, vendingMachineId);
    }

    @Transactional(readOnly = true)
    public Page<OrderStackResponse> getMyOrderStocks(User user, Pageable pageable) {
        return orderRepository.findStocksBySellerId(user.getId(), pageable);
    }

    @Transactional(readOnly = true)
    public Page<OrderStackResponse> getMyOrderSoldout(User user, Pageable pageable) {
        return orderRepository.findSoldoutBySellerId(user.getId(), pageable);
    }

    @Transactional
    public Long save(User user, Long spaceId, List<OrderRequest> orderRequests, MultipartFile image) {
        Long bakeryId = bakeryRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException(ErrorCode.BAKERY_NOT_FOUND))
                .getId();
        Space space = spaceRepository.findById(spaceId)
                        .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_SPACE));
        if (space.getSellerId() == null || !space.getSellerId().equals(user.getId())) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_USE_SPACE);
        }
        String imageUrl = s3Service.uploadFile(image);
        //String imageUrl = ipfsService.uploadFile(image);
        if (orderRequests.size() == 1) {
            return saveSingleBreadOrder(user, spaceId, bakeryId, orderRequests.get(0), imageUrl).getId();
        } else {
            return saveMixedBreadOrder(user, spaceId, bakeryId, orderRequests, imageUrl).getId();
        }
    }


    public void payForOrder(User user, Long orderId, String accountNo) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getProductState().equals(ProductState.AVAILABLE)) {
            throw new BadRequestException(ErrorCode.FORBIDDEN_ORDER_ACCESS);
        }
        order.completePurchase(user.getId());
        int discountPrice = (int) (order.getPrice() * (1.0 - order.getDiscount()));

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                user.getUserKey(),
                adminAccount,
                "입금",
                discountPrice / 100L,
                accountNo,
                "송금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
        String sellerAccount = sellerAccount(orderId);
        transactionService.recordTransaction(
                orderId,
                accountNo,
                adminAccount,
                (long) discountPrice,
                TransactionType.BREAD_PURCHASE,
                TransactionStatus.PURCHASE
        );
    }

    public void payOrderWithIamport(User user, Long orderId, IamportPayRequest iamportPayRequest) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getProductState().equals(ProductState.AVAILABLE)) {
            throw new BadRequestException(ErrorCode.FORBIDDEN_ORDER_ACCESS);
        }
        paymentValidator.validatePayment(orderId, iamportPayRequest.getImpUid());
        order.completePurchase(user.getId());
        int discountPrice = (int) (order.getPrice() * (1.0 - order.getDiscount()));

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                user.getUserKey(),
                adminAccount,
                "입금",
                discountPrice / 100L,
                iamportPayRequest.getAccount(),
                "송금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
        String sellerAccount = sellerAccount(orderId);
        transactionService.recordTransaction(
                orderId,
                iamportPayRequest.getAccount(),
                adminAccount,
                (long) discountPrice,
                TransactionType.BREAD_PURCHASE,
                TransactionStatus.PURCHASE
        );
    }

    public void refundOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));
        Transaction transaction = transactionService.findByOrderId(orderId);
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));
        String sellerAccount = sellerAccount(orderId);
        if (!account.getAccountNo().equals(transaction.getSenderAccount())
                || !sellerAccount.equals(transaction.getReceiverAccount())
        ) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_REFUND_PRODUCT);
        }

        if (order.getProductState().equals(ProductState.FINISHED)) {
            throw new BadRequestException(ErrorCode.REFUND_TIME_EXCEEDED);
        }

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                adminKey,
                transaction.getSenderAccount(),
                "환불 입금",
                transaction.getTransactionBalance() / 100,
                transaction.getSenderAccount(),
                "환불 송금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
        order.cancelPurchase();
        transactionService.recordTransaction(
                orderId,
                transaction.getSenderAccount(),
                adminAccount,
                transaction.getTransactionBalance(),
                TransactionType.BREAD_PURCHASE,
                TransactionStatus.REFUND
        );
    }

    @Transactional
    public void pickupOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));
        Transaction transaction = transactionService.findByOrderId(orderId);
        if (!transaction.getSenderAccount().equals(account.getAccountNo())
                || order.getProductState().equals(ProductState.AVAILABLE)) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_PICKUP_ORDER);
        }
        if (order.getProductState().equals(ProductState.FINISHED)) {
            throw new BadRequestException(ErrorCode.ALREADY_PICKUP_ORDER);
        }

        order.completePickUp();
        Space space = spaceRepository.findById(order.getSpaceId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_SPACE));
        space.releaseOccupied();
    }

    public void settleOrder() {
        List<Long> orderIds = transactionService.findAllSettleOrderId();
        List<Transaction> transactions = transactionService.findAllByOrderIdIn(orderIds);
        List<Order> orders = orderRepository.findAllById(orderIds);
        List<Long> sellerIds = orders.stream()
                .map(Order::getSellerId)
                .distinct()
                .collect(Collectors.toList());
        List<Account> sellerAccounts = accountRepository.findAllAccountNosByUserIds(sellerIds);

        Map<Long, String> sellerAccountMap = sellerAccounts.stream()
                .collect(Collectors.toMap(Account::getUserId, Account::getAccountNo));

        Map<Long, Long> orderSellerMap = orders.stream()
                .collect(Collectors.toMap(Order::getId, Order::getSellerId));
        for (Transaction transaction : transactions) {
            Long orderId = transaction.getOrderId();
            Long sellerId = orderSellerMap.get(orderId);
            String sellerAccount = sellerAccountMap.get(sellerId);
            AccountTransferRequest accountTransferRequest  = new AccountTransferRequest(
                    adminKey,
                    sellerAccount,
                    "정산 입금",
                    transaction.getTransactionBalance() / 100,
                    adminAccount,
                    "정산 송금"
            );
            ssafyTransferService.accountTransfer(accountTransferRequest);
        }
        for (Transaction transaction : transactions) {
            Long orderId = transaction.getOrderId();
            Long sellerId = orderSellerMap.get(orderId);
            String sellerAccount = sellerAccountMap.get(sellerId);
            transactionService.recordTransaction(orderId,
                    adminAccount,
                    sellerAccount,
                    transaction.getTransactionBalance(),
                    TransactionType.BREAD_PURCHASE,
                    TransactionStatus.SETTLED);
        }
    }

    private int getWidth(List<Space> spaces) {
        return spaces.stream()
                .mapToInt(Space::getWidth)
                .max()
                .orElse(0);
    }

    private Order saveSingleBreadOrder(
            User user,
            Long spaceId,
            Long bakeryId,
            OrderRequest request,
            String imageUrl
    ) {
        LocalDateTime expirationDate = getExpirationDate();

        Order order = Order.builder()
                .bakeryId(bakeryId)
                .sellerId(user.getId())
                .spaceId(spaceId)
                .buyerId(null)
                .price(request.getPrice())
                .discount(request.getDiscount() * 1.0)
                .count(request.getCount())
                .image(imageUrl) // 이미지 업로드 시 로직 필요
                .expirationDate(expirationDate)
                .productState(ProductState.AVAILABLE)
                .breadType(request.getBreadType())
                .build();
        return orderRepository.save(order);
    }

    private Order saveMixedBreadOrder(
            User user,
            Long spaceId,
            Long bakeryId,
            List<OrderRequest> requests,
            String imageUrl
    ) {
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
                .image(imageUrl) // 이미지 업로드 시 로직 필요
                .expirationDate(expirationDate)
                .productState(ProductState.AVAILABLE)
                .breadType(BreadType.MIXED_BREAD)
                .build();

        return orderRepository.save(mixedOrder);
    }

    private LocalDateTime getExpirationDate() {
        return LocalDateTime.now()
                .plusDays(1)
                .withHour(10)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
    }

    private String sellerAccount(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));
        User user = userRepository.findById(order.getSellerId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));
        return account.getAccountNo();
    }
//    @Scheduled(cron = "0 10 10 * * *")
//    @Transactional
//    public void expireOutdatedOrders() {
//        List<Order> orders = orderRepository.findAllByExpirationDateBefore();
//        for (Order order : orders) {
//            order.setProductState(ProductState.EXPIRED);
//        }
//    }
}
