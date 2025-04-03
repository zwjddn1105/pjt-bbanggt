package com.breadbolletguys.breadbread.account.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponse {
    String bankName;
    String accountNo;
    Long accountBalance;
}
