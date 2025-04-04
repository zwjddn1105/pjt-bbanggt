package com.breadbolletguys.breadbread.chat.domain.dto.response;

public record ChatInfo(
        String content,
        Long senderId
) {
    public static ChatInfo from(String content, Long senderId) {
        return new ChatInfo(content, senderId);
    }
}
