package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.bakery.domain.dto.response.ReviewResponse;

public interface ReviewQueryRepository {
    List<ReviewResponse> findByBakeryId(Long bakeryId);
}
