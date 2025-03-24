package com.breadbolletguys.breadbread.bakery.domain.repository;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QBakery;
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
}
