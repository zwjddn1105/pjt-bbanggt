package com.breadbolletguys.breadbread.transaction.application;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.transaction.domain.Transaction;
import com.breadbolletguys.breadbread.transaction.domain.TransactionStatus;
import com.breadbolletguys.breadbread.transaction.domain.TransactionType;
import com.breadbolletguys.breadbread.transaction.domain.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Transactional
    public void recordTransaction(
            Long orderId,
            String senderAccountNo,
            String receiverAccountNo,
            Long balance,
            TransactionType transactionType,
            TransactionStatus transactionStatus
    ) {
        transactionRepository.save(
                Transaction.builder()
                        .orderId(orderId)
                        .senderAccount(senderAccountNo)
                        .receiverAccount(receiverAccountNo)
                        .transactionBalance(balance)
                        .transactionType(transactionType)
                        .transactionStatus(transactionStatus)
                        .build()
        );
    }

    public List<Long> findAllSettleOrderId() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.minusMonths(1);
        return transactionRepository.findAllSettleOrderId(start, now);
    }

    public Transaction findByOrderId(Long orderId) {
        return transactionRepository.findByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.Transaction_NOT_FOUND));
    }

    public List<Transaction> findAllByOrderIdIn(List<Long> orderIds) {
        return transactionRepository.findAllByOrderIdIn(orderIds);
    }
}
