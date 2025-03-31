package com.breadbolletguys.breadbread.chat.domain.dto.response;

public record ChatQueryResponse(
        Long roomId,
        String content
) {
}
