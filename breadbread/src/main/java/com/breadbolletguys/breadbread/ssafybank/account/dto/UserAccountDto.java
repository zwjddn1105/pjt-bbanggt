package com.breadbolletguys.breadbread.ssafybank.account.dto;

public record UserAccountDto(
    String bankCode,
    String bankName,
    String userName,
    String accountNo,
    String accountName,
    String accountTypeCode,
    String accountTypeName,
    String accountCreatedDate,
    String accountExpiryDate,
    Long dailyTransferLimit,
    Long oneTimeTransferLimit,
    Long accountBalance,
    String lastTransactionDate,
    String currency
) {
}
