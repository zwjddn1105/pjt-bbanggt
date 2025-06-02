package com.breadbolletguys.breadbread.ssafybank.transfer.request;

/**
 *
 * @param userKey
 * @param accountNo
 * @param transactionBalance
 * @param transactionSummary : Summary 메모 같은 건 가봄 설명이 없음.
 */
public record AccountDepositRequest(
    String userKey,
    String accountNo,
    Long transactionBalance,
    String transactionSummary
) {
}
