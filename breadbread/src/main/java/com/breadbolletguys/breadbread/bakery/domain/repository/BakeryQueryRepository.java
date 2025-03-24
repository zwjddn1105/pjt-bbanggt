package com.breadbolletguys.breadbread.bakery.domain.repository;

public interface BakeryQueryRepository {
    void decreaseReview(Long bakeryId);

    void increaseReview(Long bakeryId);
}
