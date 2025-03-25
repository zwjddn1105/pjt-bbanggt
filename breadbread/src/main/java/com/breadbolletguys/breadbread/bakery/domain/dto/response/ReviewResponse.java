package com.breadbolletguys.breadbread.bakery.domain.dto.response;

import java.util.List;

import com.breadbolletguys.breadbread.bakery.domain.Score;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long id;
    private String name;
    private String content;
    private Integer score;
    private List<String> imageUrls;
}
