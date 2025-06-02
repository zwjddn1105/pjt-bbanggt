package com.breadbolletguys.breadbread.ssafybank.account.response;

import com.breadbolletguys.breadbread.ssafybank.account.dto.CreateAccountDto;
import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record CreateAccountResponse(
    SsafyBankRequestHeader Header,
    CreateAccountDto REC
) {
}
