package com.breadbolletguys.breadbread.transaction.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "sender_account", length = 32, nullable = false)
    private String senderAccount;

    @Column(name = "receiver_account", length = 32, nullable = false)
    private String receiverAccount;

    @Column(name = "transaction_balance", nullable = false)
    private Long transactionBalance;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status", nullable = false)
    private TransactionStatus transactionStatus;

    @Builder
    public Transaction(
            Long orderId,
            String senderAccount,
            String receiverAccount,
            Long transactionBalance,
            TransactionType transactionType,
            TransactionStatus transactionStatus
    ) {
        this.orderId = orderId;
        this.senderAccount = senderAccount;
        this.receiverAccount = receiverAccount;
        this.transactionBalance = transactionBalance;
        this.transactionDate = LocalDateTime.now();
        this.transactionType = transactionType;
        this.transactionStatus = transactionStatus;
    }
}
