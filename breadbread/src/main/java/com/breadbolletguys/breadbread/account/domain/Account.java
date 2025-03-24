package com.breadbolletguys.breadbread.account.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Column(name = "swift_code", nullable = false)
    private String swiftCode;

    @Column(name = "is_seller_account", nullable = false)
    private boolean isSellerAccount;

    @Embedded
    @Column(name = "balance", nullable = false)
    private Balance balance;
}
