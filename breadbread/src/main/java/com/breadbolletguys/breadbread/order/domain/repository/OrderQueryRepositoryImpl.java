package com.breadbolletguys.breadbread.order.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QBakery;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.QOrder;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.QSpace;
import com.breadbolletguys.breadbread.vendingmachine.domain.QVendingMachine;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderQueryRepositoryImpl implements OrderQueryRepository {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<OrderResponse> findByVendingMachineId(Long vendingMachineId) {
        QSpace qSpace = QSpace.space;
        QOrder qOrder = QOrder.order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = QVendingMachine.vendingMachine;
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.memo,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "CAST({0} * (1 - {1}) AS INTEGER)",
                                QOrder.order.price,
                                QOrder.order.discount
                        ),
                        qOrder.count,
                        qOrder.image,
                        qOrder.productState,
                        qOrder.breadType
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .where(qSpace.vendingMachineId.eq(vendingMachineId)
                        .and(qOrder.productState.eq(ProductState.AVAILABLE)))
                .fetch();
    }

    @Override
    public List<OrderResponse> findByBuyerId(Long userId) {
        QSpace qSpace = QSpace.space;
        QOrder qOrder = QOrder.order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = QVendingMachine.vendingMachine;
        LocalDateTime now = LocalDateTime.now();
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.memo,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "CAST({0} * (1 - {1}) AS SIGNED)",
                                QOrder.order.price,
                                QOrder.order.discount
                        ),
                        qOrder.count,
                        qOrder.image,
                        qOrder.productState
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .where(qOrder.buyerId.eq(userId)
                        .and(qOrder.productState.eq(ProductState.SOLD_OUT))
                        .and(qOrder.expirationDate.between(now, now.plusDays(1))))
                .fetch();
    }

    @Override
    public List<OrderStackResponse> findStocksBySellerId(Long userId) {
        QSpace qSpace = QSpace.space;
        QOrder qOrder = QOrder.order;
        QVendingMachine qVendingMachine = QVendingMachine.vendingMachine;

        return queryFactory
                .select(Projections.constructor(
                        OrderStackResponse.class,
                        qOrder.id,
                        qVendingMachine.memo,
                        qOrder.count,
                        qOrder.productState
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .where(qOrder.sellerId.eq(userId))
                .fetch();
    }

    @Override
    public OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId) {
        QSpace qSpace = QSpace.space;
        QOrder qOrder = QOrder.order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = QVendingMachine.vendingMachine;
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.memo,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "CAST({0} * (1 - {1}) AS INTEGER)",
                                QOrder.order.price,
                                QOrder.order.discount
                        ),
                        qOrder.count,
                        qOrder.image,
                        qOrder.productState,
                        qOrder.breadType
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .where(qSpace.vendingMachineId.eq(vendingMachineId)
                        .and(qOrder.id.eq(id))
                        .and(qOrder.productState.eq(ProductState.AVAILABLE)))
                .fetchOne();
    }

    @Override
    public List<Order> findAllByExpirationDateBefore() {
        QOrder qOrder = QOrder.order;
        LocalDateTime endOfToday = LocalDateTime.now();
        return queryFactory
                .selectFrom(qOrder)
                .where(qOrder.expirationDate.loe(endOfToday)
                        .and(qOrder.productState.eq(ProductState.AVAILABLE)))
                .fetch();
    }

    @Override
    public List<Order> findAvailableOrdersBySpaceIds(List<Long> spaceIds) {
        QOrder qOrder = QOrder.order;
        return queryFactory
                .selectFrom(qOrder)
                .where(qOrder.spaceId.in(spaceIds)
                        .and(qOrder.productState.eq(ProductState.AVAILABLE)))
                .fetch();
    }
}
