package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.QReview;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.ReviewResponse;
import com.breadbolletguys.breadbread.user.domain.QUser;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReviewQueryRepositoryImpl implements ReviewQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Page<ReviewResponse> findReviewByBakeryIdWithPagenation(Long bakeryId, Pageable pageable) {
        QReview qReview = QReview.review;
        QUser qUser = QUser.user;

        List<ReviewResponse> results = jpaQueryFactory
                .select(Projections.constructor(
                        ReviewResponse.class,
                        qReview.id,
                        qUser.name,
                        qReview.content,
                        qReview.score.score,
                        qReview.imageUrls
                ))
                .from(qReview)
                .join(qUser).on(qReview.userId.eq(qUser.id))
                .where(qReview.bakeryId.eq(bakeryId))
                .orderBy(qReview.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = jpaQueryFactory
                .select(qReview.count())
                .from(qReview)
                .where(qReview.bakeryId.eq(bakeryId))
                .fetchOne();

        return PageableExecutionUtils.getPage(results, pageable, () -> total);
    }
}
