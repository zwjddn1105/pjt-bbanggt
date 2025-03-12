package com.breadbolletguys.breadbread.auth.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserTokens {
    private final String refreshToken;
    private final String accessToken;
}
