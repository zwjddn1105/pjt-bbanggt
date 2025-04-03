package com.breadbolletguys.breadbread.ssafybank.common.response;

public record SsafyBankResponseHeader(
    String responseCode,
    String responseMessage,
    String apiName,
    String transmissionDate,
    String transmissionTime,
    String institutionCode,
    String apiKey,
    String apiServiceCode,
    String institutionTransactionUniqueNo
) {
}
