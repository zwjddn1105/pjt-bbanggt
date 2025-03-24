package com.breadbolletguys.breadbread.order.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QBakery;
import com.breadbolletguys.breadbread.order.domain.QOrder;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.QSpace;
import com.querydsl.core.types.Projections;
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
        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qBakery.name,
                        qOrder.name,
                        qOrder.price,
                        qOrder.count,
                        qOrder.expirationDate
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .where(qSpace.vendingMachineId.eq(vendingMachineId))
                .fetch();
    }

    @Override
    public OrderResponse findByIdAndVendingMachineId(Long id, Long vendingMachineId) {
        QSpace qSpace = QSpace.space;
        QOrder qOrder = QOrder.order;
        QBakery qBakery = QBakery.bakery;

        return queryFactory
                .select(Projections.constructor(
                        OrderResponse.class,
                        qOrder.id,
                        qBakery.name,
                        qOrder.name,
                        qOrder.price,
                        qOrder.count,
                        qOrder.expirationDate
                ))
                .from(qOrder)
                .join(qSpace).on(qOrder.spaceId.eq(qSpace.id))
                .join(qBakery).on(qOrder.bakeryId.eq(qBakery.id))
                .where(qSpace.vendingMachineId.eq(vendingMachineId), qOrder.id.eq(id))
                .fetchOne();

    }
}
