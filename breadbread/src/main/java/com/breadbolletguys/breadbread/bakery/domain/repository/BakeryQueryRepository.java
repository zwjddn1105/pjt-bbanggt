package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;

public interface BakeryQueryRepository {
    void decreaseReview(Long bakeryId);

    void increaseReview(Long bakeryId);

    BakeryResponse findBakeryBaseInfo(Long bakeryId);

    void updateAverageScore(Long bakeryId, Integer score);

    List<BakeryResponse> findBakeryBaseInfos(List<Long> bakeryIds);
}
