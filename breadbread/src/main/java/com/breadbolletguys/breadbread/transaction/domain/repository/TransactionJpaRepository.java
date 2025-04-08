package com.breadbolletguys.breadbread.transaction.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.breadbolletguys.breadbread.transaction.domain.Transaction;

public interface TransactionJpaRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByOrderId(Long orderId);

    List<Transaction> findAllByOrderIdIn(List<Long> orderIds);

    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.orderId = :orderId
        """)
    List<Transaction> findAllByOrderId(Long orderId);

    @Query("""
        SELECT t.orderId FROM Transaction t
        WHERE t.transactionStatus = 'PURCHASE'
        AND t.transactionDate >= :start
        AND t.transactionDate < :end
        AND t.orderId NOT IN (
            SELECT t2.orderId FROM Transaction t2
            WHERE t2.transactionStatus = 'REFUND'
                OR t2.transactionStatus = 'SETTLED'
        )
        """)
    List<Long> findAllSettleOrderId(@Param("before") LocalDateTime before);

    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.orderId = :orderId
        ORDER BY t.id DESC
        LIMIT 1
        """)
    Optional<Transaction> findLatestTransactionByOrderId(Long orderId);

    List<Long> findAllSettleOrderId(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
