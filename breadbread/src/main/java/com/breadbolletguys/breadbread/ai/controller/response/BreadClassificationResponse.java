package com.breadbolletguys.breadbread.ai.controller.response;

import java.util.List;

public record BreadClassificationResponse(
    List<Pair> breads
) {
    record Pair(
        String classification,
        Integer stock
    ) { }
}
