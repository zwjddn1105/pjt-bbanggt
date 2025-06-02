package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QBakery;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BakeryQueryRepositoryImpl implements BakeryQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public BakeryResponse findBakeryBaseInfo(Long bakeryId) {
        QBakery qBakery = QBakery.bakery;
        return jpaQueryFactory
                .select(Projections.constructor(
                        BakeryResponse.class,
                        qBakery.id,
                        qBakery.name,
                        qBakery.address,
                        Expressions.constant(false)
                ))
                .from(qBakery)
                .where(qBakery.id.eq(bakeryId))
                .fetchOne();
    }

    @Override
    public List<BakeryResponse> findBakeryBaseInfos(List<Long> bakeryIds) {
        if (bakeryIds == null || bakeryIds.isEmpty()) {
            return Collections.emptyList();
        }

        QBakery qBakery = QBakery.bakery;

        return jpaQueryFactory
                .select(Projections.constructor(
                        BakeryResponse.class,
                        qBakery.id,
                        qBakery.name,
                        qBakery.address,
                        Expressions.constant(true)
                ))
                .from(qBakery)
                .where(qBakery.id.in(bakeryIds))
                .fetch();
    }

}
