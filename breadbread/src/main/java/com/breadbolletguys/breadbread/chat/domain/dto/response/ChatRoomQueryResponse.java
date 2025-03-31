package com.breadbolletguys.breadbread.chat.domain.dto.response;

import java.time.LocalDateTime;

public record ChatRoomQueryResponse(
    Long chatRoomId,
    String name,
    Long ownerId,
    Long customerId,
    String customerName,
    LocalDateTime createdAt
) {
}
