package com.breadbolletguys.breadbread.bakery.domain.repository;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QBakery;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BakeryQueryRepositoryImpl implements BakeryQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public void increaseReview(Long bakeryId) {
        QBakery qBakery = QBakery.bakery;
        jpaQueryFactory.update(qBakery)
                .set(qBakery.reviewCount, qBakery.reviewCount.add(1))
                .where(qBakery.id.eq(bakeryId))
                .execute();
    }

    @Override
    public void decreaseReview(Long bakeryId) {
        QBakery qBakery = QBakery.bakery;
        jpaQueryFactory.update(qBakery)
                .set(qBakery.reviewCount, qBakery.reviewCount.add(-1))
                .where(qBakery.id.eq(bakeryId))
                .execute();
    }

    @Override
    public BakeryResponse findByBakeryId(Long bakeryId) {
        QBakery qBakery = QBakery.bakery;
        return jpaQueryFactory
                .select(Projections.constructor(
                        BakeryResponse.class,
                        qBakery.id,
                        qBakery.name,
                        qBakery.homepageUrl,
                        qBakery.address,
                        qBakery.phone
                ))
                .from(qBakery)
                .where(qBakery.id.eq(bakeryId))
                .fetchOne();
    }
}
