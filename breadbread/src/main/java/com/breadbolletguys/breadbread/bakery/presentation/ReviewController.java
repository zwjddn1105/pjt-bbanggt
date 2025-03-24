package com.breadbolletguys.breadbread.bakery.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.bakery.application.ReviewService;
import com.breadbolletguys.breadbread.bakery.domain.dto.request.ReviewRequest;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/review")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/createReview/{bakeryId}")
    public ResponseEntity<Void> createReview(
            @AuthUser User user,
            @PathVariable("bakeryId") Long bakeryId,
            @RequestBody ReviewRequest reviewRequest) {
        reviewService.save(user, bakeryId, reviewRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteReview/{bakeryId}/{reviewId}")
    public ResponseEntity<Void> deleteReview(@AuthUser User user,
                                             @PathVariable("bakeryId") Long bakeryId,
                                             @PathVariable("reviewId") Long reviewId) {
        reviewService.delete(user, bakeryId, reviewId);
        return ResponseEntity.ok().build();
    }
}
