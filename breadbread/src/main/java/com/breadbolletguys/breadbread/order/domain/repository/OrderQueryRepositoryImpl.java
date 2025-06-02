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
import com.breadbolletguys.breadbread.image.domain.QNftImage;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.QOrder;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderCountQueryResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderStackResponse;
import com.breadbolletguys.breadbread.transaction.domain.QTransaction;
import com.breadbolletguys.breadbread.transaction.domain.TransactionStatus;
import com.breadbolletguys.breadbread.vendingmachine.domain.QSpace;
import com.breadbolletguys.breadbread.vendingmachine.domain.QVendingMachine;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
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
        QTransaction qTransaction = QTransaction.transaction;
        QTransaction subQTransaction = new QTransaction("subTransaction");

        JPQLQuery<Long> latestTransactionIdSubquery = JPAExpressions
                .select(subQTransaction.id.max())
                .from(subQTransaction)
                .where(subQTransaction.orderId.eq(qOrder.id));
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
                                "FLOOR({0} * (1 - {1}))",
                                qOrder.price,
                                qOrder.discount
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
                        slotNumberExpr,
                        qTransaction.transactionDate
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .leftJoin(qTransaction).on(
                        qTransaction.id.eq(latestTransactionIdSubquery)
                                .and(qTransaction.transactionStatus.eq(TransactionStatus.PURCHASE))
                )
                .where(qOrder.buyerId.eq(userId)
                        .and(qOrder.productState.eq(ProductState.SOLD_OUT)
                                .or(qOrder.productState.eq(ProductState.FINISHED))))
                .fetch();
    }

    @Override
    public List<OrderResponse> findBySellerId(Long userId, Long vendingMachineId) {
        QSpace qSpace = space;
        QOrder qOrder = order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = vendingMachine;
        QTransaction qTransaction = QTransaction.transaction;
        QTransaction subQTransaction = new QTransaction("subTransaction");
        JPQLQuery<Long> latestTransactionIdSubquery = JPAExpressions
                .select(subQTransaction.id.max())
                .from(subQTransaction)
                .where(subQTransaction.orderId.eq(qOrder.id));
        LocalDateTime now = LocalDateTime.now();
        NumberTemplate<Integer> slotNumberExpr = Expressions.numberTemplate(
                Integer.class,
                "({0} * {1}) + {2} + 1",
                qSpace.height, qVendingMachine.width, qSpace.width
        );
        Expression<LocalDateTime> paymentDateExpr = new CaseBuilder()
                .when(qOrder.productState.eq(ProductState.SOLD_OUT))
                .then(qTransaction.transactionDate)
                .otherwise((LocalDateTime) null);
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.address,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "FLOOR({0} * (1 - {1}))",
                                qOrder.price,
                                qOrder.discount
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
                        slotNumberExpr,
                        paymentDateExpr
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .leftJoin(qTransaction).on(
                        qTransaction.id.eq(latestTransactionIdSubquery)
                                .and(qTransaction.transactionStatus.eq(TransactionStatus.PURCHASE))
                )
                .where(qVendingMachine.id.eq(vendingMachineId)
                        .and(qOrder.sellerId.eq(userId))
                        .and(qOrder.productState.in(
                                ProductState.AVAILABLE,
                                ProductState.SOLD_OUT,
                                ProductState.FINISHED)
                        )
                )
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
                        qVendingMachine.id,
                        qVendingMachine.name,
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
                        qVendingMachine.id,
                        qVendingMachine.name,
                        qOrder.productState
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .where(qOrder.sellerId.eq(userId)
                        .and(qOrder.productState.in(ProductState.SOLD_OUT, ProductState.FINISHED)))
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
    public OrderResponse findByIdAndVendingMachineId(Long orderId, Long vendingMachineId) {
        QSpace qSpace = QSpace.space;
        QOrder qOrder = QOrder.order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = QVendingMachine.vendingMachine;
        NumberTemplate<Integer> slotNumberExpr = Expressions.numberTemplate(
                Integer.class,
                "({0} * {1}) + {2} + 1",
                qSpace.height, qVendingMachine.width, qSpace.width
        );

        OrderResponse response = queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.address,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "FLOOR({0} * (1 - {1}))",
                                qOrder.price,
                                qOrder.discount
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
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .where(
                        qOrder.id.eq(orderId),
                        qVendingMachine.id.eq(vendingMachineId),
                        qOrder.productState.in(ProductState.AVAILABLE, ProductState.SOLD_OUT, ProductState.FINISHED)
                )
                .fetchOne();

        if (response != null) {
            response.setPaymentDate(null);
        }

        return response;

    }

    @Override
    public Integer countAvailableOrderByVendingMachineId(Long vendingMachineId) {
        return queryFactory.select(order.count().intValue())
                .from(order)
                .innerJoin(space).on(order.spaceId.eq(space.id))
                .innerJoin(vendingMachine).on(space.vendingMachineId.eq(vendingMachine.id))
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
                .innerJoin(space).on(order.spaceId.eq(space.id))
                .innerJoin(vendingMachine).on(space.vendingMachineId.eq(vendingMachine.id))
                .where(vendingMachine.id.in(vendingMachineIds).and(order.productState.eq(ProductState.AVAILABLE)))
                .groupBy(vendingMachine.id)
                .fetch();
    }

    @Override
    public List<OrderResponse> findMyNFT(Long userId) {
        QSpace qSpace = space;
        QOrder qOrder = order;
        QBakery qBakery = QBakery.bakery;
        QVendingMachine qVendingMachine = vendingMachine;
        QTransaction qTransaction = QTransaction.transaction;
        QTransaction subQTransaction = new QTransaction("subTransaction");

        JPQLQuery<Long> latestTransactionIdSubquery = JPAExpressions
                .select(subQTransaction.id.max())
                .from(subQTransaction)
                .where(subQTransaction.orderId.eq(qOrder.id));

        LocalDateTime now = LocalDateTime.now();

        NumberTemplate<Integer> slotNumberExpr = Expressions.numberTemplate(
                Integer.class,
                "({0} * {1}) + {2} + 1",
                qSpace.height, qVendingMachine.width, qSpace.width
        );

        Expression<LocalDateTime> paymentDateExpr = new CaseBuilder()
                .when(qOrder.productState.eq(ProductState.SOLD_OUT))
                .then(qTransaction.transactionDate)
                .otherwise((LocalDateTime) null);

        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qVendingMachine.address,
                        qBakery.name,
                        qOrder.price,
                        Expressions.numberTemplate(
                                Integer.class,
                                "FLOOR({0} * (1 - {1}))",
                                qOrder.price,
                                qOrder.discount
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
                        slotNumberExpr,
                        paymentDateExpr
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .join(qVendingMachine).on(qSpace.vendingMachineId.eq(qVendingMachine.id))
                .leftJoin(qTransaction).on(
                        qTransaction.id.eq(latestTransactionIdSubquery))
                .where(qOrder.sellerId.eq(userId))
                .fetch();
    }
}