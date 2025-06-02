package com.client.httpclient1;

public record CreateAccountRequest(
    String apiKey,
    String userId
) {
}
