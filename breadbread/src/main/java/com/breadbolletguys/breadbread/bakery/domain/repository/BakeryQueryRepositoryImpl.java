package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QBakery;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
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
    public BakeryResponse findBakeryBaseInfo(Long bakeryId) {
        QBakery qBakery = QBakery.bakery;
        return jpaQueryFactory
                .select(Projections.constructor(
                        BakeryResponse.class,
                        qBakery.id,
                        qBakery.name,
                        qBakery.homepageUrl,
                        qBakery.address,
                        qBakery.phone,
                        Expressions.constant(false)
                ))
                .from(qBakery)
                .where(qBakery.id.eq(bakeryId))
                .fetchOne();
    }

    @Override
    public void updateAverageScore(Long bakeryId, Integer score) {
        QBakery qBakery = QBakery.bakery;

        Tuple result = jpaQueryFactory
                .select(qBakery.reviewCount, qBakery.averageScore)
                .from(qBakery)
                .where(qBakery.id.eq(bakeryId))
                .fetchOne();

        if (result == null) {
            return;
        }

        Integer reviewCount = result.get(qBakery.reviewCount);
        Double averageScore = result.get(qBakery.averageScore);

        int newReviewCount = reviewCount + 1;
        double newAverage = ((averageScore * reviewCount) + score) / newReviewCount;

        jpaQueryFactory
                .update(qBakery)
                .set(qBakery.averageScore, newAverage)
                .where(qBakery.id.eq(bakeryId))
                .execute();
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
                        qBakery.homepageUrl,
                        qBakery.address,
                        qBakery.phone,
                        Expressions.constant(true)  // 북마크된 항목이므로 true 고정
                ))
                .from(qBakery)
                .where(qBakery.id.in(bakeryIds))  // <--- 여기서 IN 사용
                .fetch();
    }

}
