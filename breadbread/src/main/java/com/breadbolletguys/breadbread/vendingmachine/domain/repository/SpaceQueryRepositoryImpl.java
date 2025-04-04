package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import static com.breadbolletguys.breadbread.vendingmachine.domain.QSpace.space;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SpaceCountQueryResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SpaceQueryRepositoryImpl implements SpaceQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<SpaceCountQueryResponse> findSpaceCountsByVendingMachineIds(List<Long> vendingMachineIds) {
        return queryFactory.select(
                Projections.constructor(
                        SpaceCountQueryResponse.class,
                        space.count().intValue(),
                        space.vendingMachineId
                )).from(space)
                .where(space.vendingMachineId.in(vendingMachineIds).and(space.occupied.eq(false)))
                .groupBy(space.vendingMachineId)
                .fetch();
    }
}
