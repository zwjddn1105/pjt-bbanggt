package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.breadbolletguys.breadbread.order.domain.Order;

public interface OrderJpaRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o.spaceId FROM Order o WHERE o.bakeryId IN :bakeryIds")
    List<Long> findSpaceIdsByBakeryIds(@Param("bakeryIds") List<Long> bakeryIds);
}
