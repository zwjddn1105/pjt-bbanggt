package com.breadbolletguys.breadbread.ssafybank.common.response;

public record SsafyBankErrorResponse(
    String responseCode,
    String responseMessage
) {
}
