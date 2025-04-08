package com.breadbolletguys.breadbread.user.domain.dto.response;

import com.breadbolletguys.breadbread.user.domain.User;

public record UserResponse(
    Long id,
    String name,
    boolean noticeCheck,
    int tickets
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.isNoticeCheck(),
                user.getTickets()
        );
    }
}
