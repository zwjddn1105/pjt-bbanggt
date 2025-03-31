package com.breadbolletguys.breadbread.ssafybank.account.response;

import com.breadbolletguys.breadbread.ssafybank.account.dto.AccountProductDto;
import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

import java.util.List;

public record FindAccountResponse(
    SsafyBankRequestHeader Header,
    List<AccountProductDto> REC
) {
}
