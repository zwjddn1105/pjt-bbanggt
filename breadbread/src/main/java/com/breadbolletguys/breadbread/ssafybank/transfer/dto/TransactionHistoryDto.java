package com.breadbolletguys.breadbread.ssafybank.transfer.dto;

public record TransactionHistoryDto(
    Long transactionUniqueNo,
    String transactionDate,
    String transactionType,
    String transactionTypeName,
    String transactionAccountNo,
    Long transactionBalance,
    Long transactionAfterBalance,
    String transactionSummary,
    String transactionMemo
) {
}
