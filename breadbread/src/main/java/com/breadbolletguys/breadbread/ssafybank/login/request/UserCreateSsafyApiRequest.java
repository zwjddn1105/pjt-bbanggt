package com.breadbolletguys.breadbread.ssafybank.login.request;

public record UserCreateSsafyApiRequest(
    String apiKey,
    String userId
) {
}
