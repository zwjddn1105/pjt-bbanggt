package com.breadbolletguys.breadbread.order.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.order.domain.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderJpaRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o.spaceId FROM Order o WHERE o.bakeryId IN :bakeryIds")
    List<Long> findSpaceIdsByBakeryIds(@Param("bakeryIds") List<Long> bakeryIds);
}
