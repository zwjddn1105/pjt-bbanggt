package com.breadbolletguys.breadbread.ssafybank.login.response;

public record CreateUserSsafyApiResponse(
    String userId,
    String username,
    String institutionCode,
    String userKey,
    String created,
    String modified
) {
}
