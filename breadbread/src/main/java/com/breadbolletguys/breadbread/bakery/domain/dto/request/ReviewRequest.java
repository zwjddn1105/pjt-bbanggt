package com.breadbolletguys.breadbread.bakery.domain.dto.request;

import java.util.List;

import com.breadbolletguys.breadbread.bakery.domain.Score;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    private String content;
    private Score score;
    private List<String> imageUrls;
}