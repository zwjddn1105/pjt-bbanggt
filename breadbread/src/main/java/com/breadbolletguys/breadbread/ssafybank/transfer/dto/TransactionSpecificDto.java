package com.breadbolletguys.breadbread.ssafybank.transfer.dto;

public record TransactionSpecificDto(
    Long transactionUniqueNo,
    String accountNo,
    String transactionDate,
    String transactionType,
    String transactionTypeName,
    String transactionAccountNo
) {
}
