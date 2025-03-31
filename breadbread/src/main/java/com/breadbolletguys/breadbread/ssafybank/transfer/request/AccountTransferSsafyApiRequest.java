package com.breadbolletguys.breadbread.ssafybank.transfer.request;

import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record AccountTransferSsafyApiRequest(
    SsafyBankRequestHeader Header,
    String depositAccountNo,
    String depositTransactionSummary,
    Long transactionBalance,
    String withdrawalAccountNo,
    String withdrawalTransactionSummary
) {
}
