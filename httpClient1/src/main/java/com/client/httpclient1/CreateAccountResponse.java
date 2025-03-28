package com.client.httpclient1;

public record CreateAccountResponse(
    String userId,
    String username,
    String institutionCode,
    String userKey,
    String created,
    String modified
) {
}
