package com.breadbolletguys.breadbread.bakery.domain;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.SCORE_RANGE_ERROR;
import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Embeddable;

import com.breadbolletguys.breadbread.common.exception.BadRequestException;

import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor(access = PROTECTED)
public class Score {
    private Integer score;

    Score(Integer score) {
        scoreValidation(score);
        this.score = score;
    }

    private void scoreValidation(Integer score) {
        if (score <= 0 || score > 5) {
            throw new BadRequestException(SCORE_RANGE_ERROR);
        }
    }
}
