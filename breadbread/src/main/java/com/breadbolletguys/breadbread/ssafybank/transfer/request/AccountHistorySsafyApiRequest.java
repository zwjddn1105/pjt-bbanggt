package com.breadbolletguys.breadbread.ssafybank.transfer.request;

import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record AccountHistorySsafyApiRequest(
    SsafyBankRequestHeader Header,
    String accountNo,
    String startDate,
    String endDate,
    String transactionType,
    String orderByType
) {
}
