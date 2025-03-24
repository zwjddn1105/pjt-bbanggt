package com.breadbolletguys.breadbread.bakery.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.Review;
import com.breadbolletguys.breadbread.bakery.domain.dto.request.ReviewRequest;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.ReviewResponse;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.bakery.domain.repository.ReviewRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final BakeryRepository bakeryRepository;

    public List<ReviewResponse> findByBakeryId(Long bakeryId) {
        return reviewRepository.findByBakeryId(bakeryId);
    }

    public void save(User user, Long bakeryId, ReviewRequest reviewRequest) {
        Bakery bakery = bakeryRepository.findById(bakeryId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BAKERY_NOT_FOUND));
        Review review = Review.builder()
                .userId(user.getId())
                .bakeryId(bakeryId)
                .content(reviewRequest.getContent())
                .score(reviewRequest.getScore())
                .imageUrls(reviewRequest.getImageUrls())
                .build();
        reviewRepository.save(review);
        bakeryRepository.increaseReview(bakeryId);
    }

    public void delete(User user, Long bakeryId, Long reviewId) {
        Review review = reviewRepository.findById(bakeryId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.REVIEW_NOT_FOUND));
        if (!review.getUserId().equals(user.getId())) {
            throw new BadRequestException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
        reviewRepository.deleteById(reviewId);
        bakeryRepository.decreaseReview(bakeryId);
    }
}
