package com.breadbolletguys.breadbread.bakery.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.breadbolletguys.breadbread.bakery.domain.dto.response.ReviewResponse;

public interface ReviewQueryRepository {
    Page<ReviewResponse> findReviewByBakeryIdWithPagenation(Long bakeryId, Pageable pageable);
}
