package com.breadbolletguys.breadbread.chat.domain.dto.response;

import java.time.LocalDateTime;

public record ChatRoomBuyerOnlyResponse(
        Long chatRoomId,
        String name,
        String lastContent,
        LocalDateTime createdAt
) {
}
