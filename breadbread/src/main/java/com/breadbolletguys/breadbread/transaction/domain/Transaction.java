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

    @Column(name = "sender_account", length = 32, nullable = false)
    private String senderAccount;

    @Column(name = "receiver_account", length = 32, nullable = false)
    private String receiverAccount;

    @Column(name = "amount")
    private int amount;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "sender_account_swiftCode", length = 8, nullable = false)
    private String senderAccountSwiftCode;

    @Column(name = "receiver_account_swiftCode", length = 8, nullable = false)
    private String receiverAccountSwiftCode;

    @Column(name = "sender_name", length = 32, nullable = false)
    private String senderName;

    @Column(name = "receiver_name", length = 32, nullable = false)
    private String receiverName;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Builder
    public Transaction(
            String senderAccount,
            String receiverAccount,
            int amount,
            String senderAccountSwiftCode,
            String receiverAccountSwiftCode,
            String senderName,
            String receiverName,
            TransactionType transactionType
    ) {
        this.senderAccount = senderAccount;
        this.receiverAccount = receiverAccount;
        this.amount = amount;
        this.transactionDate = LocalDateTime.now();
        this.senderAccountSwiftCode = senderAccountSwiftCode;
        this.receiverAccountSwiftCode = receiverAccountSwiftCode;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.transactionType = transactionType;
    }
}
