package com.breadbolletguys.breadbread.transaction.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.transaction.domain.Transaction;

public interface TransactionJpaRepository extends JpaRepository<Transaction, Long> {
}
