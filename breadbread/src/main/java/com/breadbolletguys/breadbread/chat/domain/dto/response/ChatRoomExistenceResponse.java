package com.breadbolletguys.breadbread.chat.domain.dto.response;

public record ChatRoomExistenceResponse(
        boolean isExist,
        Long id
) {
    public static ChatRoomExistenceResponse of(
            boolean isExist,
            Long id
    ) {
        return new ChatRoomExistenceResponse(
                isExist,
                id
        );
    }
}
