package com.breadbolletguys.breadbread.order.application;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
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
import com.breadbolletguys.breadbread.transaction.domain.repository.TransactionRepository;
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
    private final TransactionRepository transactionRepository;
    private final S3Service s3Service;
    private final IpfsServiceFacade ipfsServiceFacade;
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
        // Image를 분산 원장에 저장한다.
        // String imageUrl2 = ipfsService.uploadFile(image);
        // NFTService.saveImage(ddlkdlqk)
        // image 를 분산 원장에서 URL을 가져온다. ->
        // ipfsServiceFacade.uploadImage();
        // NFT 거기서 가져오는 거잖아?
        if (orderRequests.size() == 1) {
            Order order = saveSingleBreadOrder(user, spaceId, bakeryId, orderRequests.get(0), imageUrl);
            ipfsServiceFacade.uploadImage(order.getId(), image);
            return order.getId();
        } else {
            Order order = saveMixedBreadOrder(user, spaceId, bakeryId, orderRequests, imageUrl);
            ipfsServiceFacade.uploadImage(order.getId(), image);
            return order.getId();
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
        Account account  = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));
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
                account.getAccountNo(),
                "송금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
        transactionService.recordTransaction(
                orderId,
                account.getAccountNo(),
                adminAccount,
                (long) discountPrice,
                TransactionType.BREAD_PURCHASE,
                TransactionStatus.PURCHASE
        );
    }

    public void refundOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));
        Transaction transaction = transactionRepository.findLatestTransactionByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.Transaction_NOT_FOUND));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));
        if (!transaction.getTransactionStatus().equals(TransactionStatus.PURCHASE)) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_REFUND_PRODUCT);
        }
        if (!account.getAccountNo().equals(transaction.getSenderAccount())) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_REFUND_PRODUCT);
        }

        if (order.getProductState().equals(ProductState.FINISHED)) {
            throw new BadRequestException(ErrorCode.CANCEL_TIME_EXCEEDED);
        }

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                adminKey,
                transaction.getSenderAccount(),
                "주문 취소 입금",
                transaction.getTransactionBalance() / 100,
                adminAccount,
                "주문 취소 송금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
        order.cancelPurchase();
        transactionService.recordTransaction(
                orderId,
                transaction.getSenderAccount(),
                adminAccount,
                transaction.getTransactionBalance(),
                TransactionType.BREAD_PURCHASE,
                TransactionStatus.CANCELED
        );
    }

    @Transactional
    public void pickupOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));
        Transaction transaction = transactionRepository.findLatestTransactionByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.Transaction_NOT_FOUND));
        if (!transaction.getTransactionStatus().equals(TransactionStatus.PURCHASE)) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_PICKUP_ORDER);
        }
        if (!transaction.getSenderAccount().equals(account.getAccountNo())
                || !order.getProductState().equals(ProductState.SOLD_OUT)) {
            throw new BadRequestException(ErrorCode.UNABLE_TO_PICKUP_ORDER);
        }
        order.completePickUp();
        Space space = spaceRepository.findById(order.getSpaceId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.NOT_FOUND_SPACE));
        space.releaseOccupied();
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
                .discount(request.getDiscount() * 1.0 / 100)
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

//    /**
//     * 매달 1일에 정산하는 스케줄러 구현
//     */
//    @Scheduled(cron = "0 0 3 1 * *", zone = "Asia/Seoul")
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

        Map<Long, List<Transaction>> sellerTransactionMap = transactions.stream()
                .collect(Collectors.groupingBy(t -> orderSellerMap.get(t.getOrderId())));

        for (Map.Entry<Long, List<Transaction>> entry : sellerTransactionMap.entrySet()) {
            Long sellerId = entry.getKey();
            List<Transaction> sellerTransactions = entry.getValue();
            String sellerAccount = sellerAccountMap.get(sellerId);

            // 총 정산 금액 계산
            long totalAmount = sellerTransactions.stream()
                    .mapToLong(Transaction::getTransactionBalance)
                    .sum();

            // 정산 송금 요청 (판매자당 1회)
            AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                    adminKey,
                    sellerAccount,
                    "정산 입금",
                    totalAmount / 100,
                    adminAccount,
                    "정산 송금"
            );
            ssafyTransferService.accountTransfer(accountTransferRequest);

            // 주문별 트랜잭션 기록
            for (Transaction transaction : sellerTransactions) {
                Long orderId = transaction.getOrderId();
                transactionService.recordTransaction(
                        orderId,
                        adminAccount,
                        sellerAccount,
                        transaction.getTransactionBalance(),
                        TransactionType.BREAD_PURCHASE,
                        TransactionStatus.SETTLED
                );
            }
        }
    }

    public List<OrderResponse> getMyNFT(User user) {
        return orderRepository.findMyNFT(user.getId());
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
