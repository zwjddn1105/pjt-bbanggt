package com.breadbolletguys.breadbread.ssafybank.login.service.request;

public record CreateSsafyUserRequest(
    String apiKey,
    String userId
) {
}
