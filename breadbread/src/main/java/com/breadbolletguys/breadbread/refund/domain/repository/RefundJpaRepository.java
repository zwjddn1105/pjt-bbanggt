package com.breadbolletguys.breadbread.refund.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.refund.domain.Refund;

public interface RefundJpaRepository extends JpaRepository<Refund, Long>, RefundQueryRepository {

    boolean existsByOrderIdAndCustomerId(Long orderId, Long customerId);
}
