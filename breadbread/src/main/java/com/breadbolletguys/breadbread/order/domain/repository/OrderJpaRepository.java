package com.breadbolletguys.breadbread.order.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.order.domain.Order;

public interface OrderJpaRepository extends JpaRepository<Order, Long> {
}
