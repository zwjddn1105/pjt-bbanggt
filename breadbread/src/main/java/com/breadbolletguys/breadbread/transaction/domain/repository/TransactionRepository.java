package com.breadbolletguys.breadbread.transaction.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.transaction.domain.Transaction;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TransactionRepository {
    private final TransactionJpaRepository transactionJpaRepository;

    public void save(Transaction transaction) {
        transactionJpaRepository.save(transaction);
    }

    public Optional<Transaction> findByOrderId(Long orderId) {
        return transactionJpaRepository.findByOrderId(orderId);
    }

    public List<Long> findAllSettleOrderId(LocalDateTime now) {
        return transactionJpaRepository.findAllSettleOrderId(now);
    }

    public List<Transaction> findAllByOrderIdIn(List<Long> orderIds) {
        return transactionJpaRepository.findAllByOrderIdIn(orderIds);
    }
}
