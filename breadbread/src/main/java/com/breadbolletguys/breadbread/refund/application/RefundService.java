package com.breadbolletguys.breadbread.refund.application;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.ALREADY_EXIST_REFUND_REQUEST;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.CAN_NOT_CONFIRM_REFUND;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.NOT_BUYER;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.NOT_SELLER;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.ORDER_NOT_FOUND;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.ORDER_REFUND_NOT_ALLOWED_YET;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.REFUND_NOT_FOUND;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.Transaction_NOT_FOUND;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.refund.domain.Refund;
import com.breadbolletguys.breadbread.refund.domain.RefundState;
import com.breadbolletguys.breadbread.refund.domain.dto.request.RefundConfirmRequest;
import com.breadbolletguys.breadbread.refund.domain.dto.request.RefundRequest;
import com.breadbolletguys.breadbread.refund.domain.dto.response.RefundResponse;
import com.breadbolletguys.breadbread.refund.domain.repository.RefundRepository;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountTransferRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.service.SsafyTransferService;
import com.breadbolletguys.breadbread.transaction.application.TransactionService;
import com.breadbolletguys.breadbread.transaction.domain.Transaction;
import com.breadbolletguys.breadbread.transaction.domain.TransactionStatus;
import com.breadbolletguys.breadbread.transaction.domain.TransactionType;
import com.breadbolletguys.breadbread.transaction.domain.repository.TransactionRepository;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefundService {

    @Value("${app.admin.userId}")
    private String adminId;

    @Value("${app.admin.userKey}")
    private String adminKey;

    @Value("${app.admin.account}")
    private String adminAccount;

    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final SsafyTransferService ssafyTransferService;
    private final TransactionService transactionService;


    public Long save(User user, RefundRequest refundRequest) {
        Order order = orderRepository.findById(refundRequest.orderId())
                .orElseThrow(() -> new BadRequestException(ORDER_NOT_FOUND));

        if (!order.isFinish()) {
            throw new BadRequestException(ORDER_REFUND_NOT_ALLOWED_YET);
        }

        if (!order.isBuyer(user)) {
            throw new BadRequestException(NOT_BUYER);
        }

        if (refundRepository.existsByOrderIdAndCustomerId(refundRequest.orderId(), user.getId())) {
            throw new BadRequestException(ALREADY_EXIST_REFUND_REQUEST);
        }

        Refund refund = Refund.builder()
                .customerId(user.getId())
                .orderId(order.getId())
                .sellerId(order.getSellerId())
                .build();

        return refundRepository.save(refund).getId();
    }

    public PageInfo<RefundResponse> findAll(User user, RefundState state, String pageToken) {
        if (!user.isSeller()) {
            throw new BadRequestException(NOT_SELLER);
        }

        return refundRepository.findBySellerIdAndState(user.getId(), state, pageToken);
    }

    @Transactional
    public void confirm(User user, RefundConfirmRequest refundConfirmRequest) {
        Refund refund = refundRepository.findById(refundConfirmRequest.refundId())
                .orElseThrow(() -> new BadRequestException(REFUND_NOT_FOUND));

        if (!refund.isSeller(user)) {
            throw new BadRequestException(NOT_SELLER);
        }

        if (!refund.canConfirm()) {
            throw new BadRequestException(CAN_NOT_CONFIRM_REFUND);
        }

        refund.confirm();
        Transaction transaction = transactionRepository.findLatestTransactionByOrderId(refund.getOrderId())
                .orElseThrow(() -> new BadRequestException(Transaction_NOT_FOUND));

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                adminKey,
                transaction.getSenderAccount(),
                "환불 입금",
                transaction.getTransactionBalance() / 100,
                adminAccount,
                "환불 송금"
        );

        ssafyTransferService.accountTransfer(accountTransferRequest);
        transactionService.recordTransaction(
                refund.getOrderId(),
                transaction.getSenderAccount(),
                adminAccount,
                transaction.getTransactionBalance(),
                TransactionType.BREAD_PURCHASE,
                TransactionStatus.REFUND
        );
    }
}
