package com.breadbolletguys.breadbread.ssafybank.account.dto;

public record AccountProductDto(
    String accountTypeUniqueNo,
    String bankCode,
    String bankName,
    String accountTypeCode,
    String accountTypeName,
    String accountDescription,
    String accountType
) {
}
