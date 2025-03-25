package com.breadbolletguys.breadbread.bakery.domain.repository;

import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;

public interface BakeryQueryRepository {
    void decreaseReview(Long bakeryId);

    void increaseReview(Long bakeryId);

    BakeryResponse findByBakeryId(Long bakeryId);
}
