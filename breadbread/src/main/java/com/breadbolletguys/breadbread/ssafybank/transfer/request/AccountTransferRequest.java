package com.breadbolletguys.breadbread.ssafybank.transfer.request;

public record AccountTransferRequest(
    String userKey,
    String depositAccountNo,
    String depositTransactionSummary,
    Long transactionBalance,
    String withdrawalAccountNo,
    String withdrawalTransactionSummary
) {
}
