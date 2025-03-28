package com.breadbolletguys.breadbread.ssafybank.login.service.response;

public record FindSsafyUserResponse(
    String userId,
    String username,
    String institutionCode,
    String userKey,
    String created,
    String modified
) {
}
