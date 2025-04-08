package com.breadbolletguys.breadbread.user.domain.dto.response;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.user.domain.User;

public record UserResponse(
    Long id,
    String name,
    boolean noticeCheck,
    int tickets,
    String bakeryName
) {
    public static UserResponse from(User user, Bakery bakery) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.isNoticeCheck(),
                user.getTickets(),
                bakery != null ? bakery.getName() : null
        );
    }
}
