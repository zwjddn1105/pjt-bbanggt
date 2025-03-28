package com.breadbolletguys.breadbread.ssafybank.common.request;

public record SsafyBankRequestHeader(
    String apiName,
    String transmissionDate,
    String transmissionTime,
    String institutionCode,
    String fintechAppNo,
    String institutionTransactionUniqueNo,
    String apiKey,
    String userKey
) {
}
