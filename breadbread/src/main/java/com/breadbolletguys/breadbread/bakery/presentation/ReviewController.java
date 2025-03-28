package com.breadbolletguys.breadbread.bakery.presentation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.bakery.application.ReviewService;
import com.breadbolletguys.breadbread.bakery.domain.dto.request.ReviewRequest;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.ReviewResponse;
import com.breadbolletguys.breadbread.user.domain.User;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/review")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/createReview/{bakeryId}")
    @Operation(description = "특정 빵집에 리뷰 정보를 입력받고 생성한다.")
    public ResponseEntity<Void> createReview(
            @AuthUser User user,
            @PathVariable("bakeryId") Long bakeryId,
            @RequestBody ReviewRequest reviewRequest) {
        reviewService.save(user, bakeryId, reviewRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{bakeryId}")
    @Operation(description = "특정 빵집의 리뷰 리스트를 조회한다.")
    public ResponseEntity<Page<ReviewResponse>> getReviews(
            @AuthUser User user,
            @PathVariable("bakeryId") Long bakeryId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(reviewService.findReviewByBakeryIdWithPagenation(bakeryId, pageable));
    }

    @DeleteMapping("/deleteReview/{bakeryId}/{reviewId}")
    @Operation(description = "리뷰 id를 pathVariable로 받아서 삭제한다.")
    public ResponseEntity<Void> deleteReview(@AuthUser User user,
                                             @PathVariable("bakeryId") Long bakeryId,
                                             @PathVariable("reviewId") Long reviewId) {
        reviewService.delete(user, bakeryId, reviewId);
        return ResponseEntity.ok().build();
    }
}
