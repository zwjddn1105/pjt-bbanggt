package com.breadbolletguys.breadbread.order.domain.repository;

import static com.breadbolletguys.breadbread.order.domain.QOrder.order;
import static com.breadbolletguys.breadbread.vendingmachine.domain.QSpace.space;
import static com.breadbolletguys.breadbread.vendingmachine.domain.QVendingMachine.vendingMachine;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QBakery;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.QOrder;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderCountQueryResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.QSpace;
import com.breadbolletguys.breadbread.vendingmachine.domain.QVendingMachine;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderQueryRepositoryImpl implements OrderQueryRepository {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<OrderResponse> findByBuyerId(Long userId) {
        QSpace qSpace = space;
        QOrder qOrder = order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = vendingMachine;
        LocalDateTime now = LocalDateTime.now();
        NumberTemplate<Integer> slotNumberExpr = Expressions.numberTemplate(
                Integer.class,
                "({0} * {1}) + {2} + 1",
                qSpace.height, qVendingMachine.width, qSpace.width
        );
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.address,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "CAST({0} * (1 - {1}) AS INTEGER)",
                                order.price,
                                order.discount
                        ),
                        qOrder.count,
                        qOrder.image,
                        qOrder.productState,
                        qOrder.breadType,
                        qBakery.id,
                        qVendingMachine.id,
                        qVendingMachine.latitude,
                        qVendingMachine.longitude,
                        qVendingMachine.name,
                        slotNumberExpr
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
    public Page<OrderStackResponse> findStocksBySellerId(Long userId, Pageable pageable) {
        QSpace qSpace = space;
        QOrder qOrder = order;
        QVendingMachine qVendingMachine = vendingMachine;

        var data = queryFactory
                .select(Projections.constructor(
                        OrderStackResponse.class,
                        qOrder.id,
                        qVendingMachine.address,
                        qOrder.count,
                        qOrder.productState
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .where(qOrder.sellerId.eq(userId)
                        .and(qOrder.productState.eq(ProductState.AVAILABLE)))
                .orderBy(qOrder.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(qOrder)
                .from(qOrder)
                .where(qOrder.sellerId.eq(userId))
                .fetchCount();

        return new PageImpl<>(data, pageable, total);
    }

    @Override
    public Page<OrderStackResponse> findSoldoutBySellerId(Long userId, Pageable pageable) {
        QSpace qSpace = space;
        QOrder qOrder = order;
        QVendingMachine qVendingMachine = vendingMachine;

        var data = queryFactory
                .select(Projections.constructor(
                        OrderStackResponse.class,
                        qOrder.id,
                        qVendingMachine.address,
                        qOrder.count,
                        qOrder.productState
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .where(qOrder.sellerId.eq(userId)
                        .and(qOrder.productState.eq(ProductState.SOLD_OUT)))
                .orderBy(qOrder.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = queryFactory
                .select(qOrder)
                .from(qOrder)
                .where(qOrder.sellerId.eq(userId))
                .fetchCount();

        return new PageImpl<>(data, pageable, total);
    }

    @Override
    public OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId) {
        QSpace qSpace = space;
        QOrder qOrder = order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = vendingMachine;
        NumberTemplate<Integer> slotNumberExpr = Expressions.numberTemplate(
                Integer.class,
                "({0} * {1}) + {2} + 1",
                qSpace.height, qVendingMachine.width, qSpace.width
        );
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.address,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "CAST({0} * (1 - {1}) AS INTEGER)",
                                order.price,
                                order.discount
                        ),
                        qOrder.count,
                        qOrder.image,
                        qOrder.productState,
                        qOrder.breadType,
                        qBakery.id,
                        qVendingMachine.id,
                        qVendingMachine.latitude,
                        qVendingMachine.longitude,
                        qVendingMachine.name,
                        slotNumberExpr
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
    public Integer countAvailableOrderByVendingMachineId(Long vendingMachineId) {
        return queryFactory.select(order.count().intValue())
                .from(order)
                .leftJoin(space).on(order.spaceId.eq(space.id))
                .leftJoin(vendingMachine).on(space.vendingMachineId.eq(vendingMachineId))
                .where(order.productState.eq(ProductState.AVAILABLE)
                        .and(space.vendingMachineId.eq(vendingMachineId)))
                .fetchOne();
    }

    @Override
    public List<OrderCountQueryResponse> findAvailableCountsByVendingMachineIds(List<Long> vendingMachineIds) {
        return queryFactory.select(
                        Projections.constructor(
                                OrderCountQueryResponse.class,
                                order.count().intValue(),
                                vendingMachine.id
                        )).from(order)
                .leftJoin(space).on(order.spaceId.eq(space.id))
                .leftJoin(vendingMachine).on(space.vendingMachineId.eq(space.vendingMachineId))
                .where(vendingMachine.id.in(vendingMachineIds))
                .groupBy(vendingMachine.id)
                .fetch();
    }
}