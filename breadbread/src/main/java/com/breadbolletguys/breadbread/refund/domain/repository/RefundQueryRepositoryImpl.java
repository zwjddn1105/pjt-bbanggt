package com.breadbolletguys.breadbread.refund.domain.repository;

import static com.breadbolletguys.breadbread.order.domain.QOrder.order;
import static com.breadbolletguys.breadbread.refund.domain.QRefund.refund;
import static com.breadbolletguys.breadbread.user.domain.QUser.user;
import static com.breadbolletguys.breadbread.vendingmachine.domain.QSpace.space;
import static com.breadbolletguys.breadbread.vendingmachine.domain.QVendingMachine.vendingMachine;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.refund.domain.RefundState;
import com.breadbolletguys.breadbread.refund.domain.dto.response.RefundResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RefundQueryRepositoryImpl implements RefundQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<RefundResponse> findBySellerIdAndState(
        Long sellerId,
        RefundState state,
        int pageSize,
        String pageToken
    ) {
        return queryFactory.select(
                Projections.constructor(
                        RefundResponse.class,
                        refund.id,
                        order.id,
                        vendingMachine.name,
                        user.name,
                        refund.createdAt,
                        order.price.intValue()
                )).from(refund)
                .join(order).on(order.id.eq(refund.orderId))
                .join(space).on(space.id.eq(order.spaceId))
                .join(vendingMachine).on(vendingMachine.id.eq(space.vendingMachineId))
                .join(user).on(user.id.eq(refund.customerId))
                .where(isInRange(pageToken),
                        refund.sellerId.eq(sellerId)
                                .and(refund.state.eq(state))
                )
                .limit(pageSize + 1)
                .fetch();
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return refund.id.lt(Long.valueOf(pageToken));
    }
}
