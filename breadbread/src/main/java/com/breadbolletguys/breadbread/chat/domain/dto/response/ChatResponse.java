package com.breadbolletguys.breadbread.chat.domain.dto.response;

import java.time.LocalDateTime;

public record ChatResponse(
        Long id,
        Long senderId,
        Long roomId,
        LocalDateTime createdAt,
        String content
) {
}
