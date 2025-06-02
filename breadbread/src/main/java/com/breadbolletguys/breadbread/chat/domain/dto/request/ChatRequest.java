package com.breadbolletguys.breadbread.chat.domain.dto.request;

public record ChatRequest(
        String content,
        Long chatRoomId
) {
}
