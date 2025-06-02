package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;

public interface OrderJpaRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o.spaceId FROM Order o WHERE o.bakeryId IN :bakeryIds")
    List<Long> findSpaceIdsByBakeryIds(@Param("bakeryIds") List<Long> bakeryIds);

    @Query("SELECT o FROM Order o WHERE o.id in :ids")
    List<Order> findAllByIdIn(List<Long> ids);

    Optional<Order> findBySpaceIdAndProductState(Long spaceId, ProductState productState);

    Optional<Order> findFirstBySpaceIdAndProductStateIn(Long spaceId, List<ProductState> productStates);
}