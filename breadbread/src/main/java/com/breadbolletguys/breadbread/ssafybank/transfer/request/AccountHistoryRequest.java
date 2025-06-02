package com.breadbolletguys.breadbread.ssafybank.transfer.request;

public record AccountHistoryRequest(
    String userKey,
    String accountNo,
    String startDate,
    String endDate,
    String transactionType,
    String orderByType
) {
}
