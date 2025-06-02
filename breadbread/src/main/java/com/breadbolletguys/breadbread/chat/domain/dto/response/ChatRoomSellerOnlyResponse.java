package com.breadbolletguys.breadbread.chat.domain.dto.response;

import java.time.LocalDateTime;

public record ChatRoomSellerOnlyResponse(
        Long chatRoomId,
        String customerName,
        LocalDateTime createdAt,
        String lastContent,
        boolean isOwner
) {
}
