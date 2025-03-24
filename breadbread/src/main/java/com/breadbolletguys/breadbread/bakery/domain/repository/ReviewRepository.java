package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.Review;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.ReviewResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReviewRepository {
    private final ReviewJpaRepository reviewJpaRepository;
    private final ReviewQueryRepository reviewQueryRepository;

    public List<ReviewResponse> findByBakeryId(Long bakeryId) {
        return reviewQueryRepository.findByBakeryId(bakeryId);
    }

    public Optional<Review> findById(Long reviewId) {
        return reviewJpaRepository.findById(reviewId);
    }

    public void save(Review review) {
        reviewJpaRepository.save(review);
    }

    public void deleteById(Long reviewId) {
        reviewJpaRepository.deleteById(reviewId);
    }
}
