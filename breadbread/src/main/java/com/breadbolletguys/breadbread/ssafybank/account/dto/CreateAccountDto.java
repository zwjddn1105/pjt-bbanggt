package com.breadbolletguys.breadbread.ssafybank.account.dto;

import com.breadbolletguys.breadbread.ssafybank.common.domain.Currency;

public record CreateAccountDto(
    String bankCode,
    String accountNo,
    Currency currency
) {
}
