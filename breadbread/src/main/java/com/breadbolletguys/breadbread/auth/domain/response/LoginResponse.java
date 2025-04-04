package com.breadbolletguys.breadbread.auth.domain.response;

public record LoginResponse(
        Long userId,
        String accessToken,
        String refreshToken
) {
    public static LoginResponse from(
            Long userId,
            String accessToken,
            String refreshToken
    ) {
        return new LoginResponse(
                userId,
                accessToken,
                refreshToken
        );
    }
}
