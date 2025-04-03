package com.breadbolletguys.breadbread.ssafybank.transfer.request;

import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record AccountWithdrawSsafyApiRequest(
    SsafyBankRequestHeader Header,
    String accountNo,
    Long transactionBalance,
    String transactionSummary
) {
}
