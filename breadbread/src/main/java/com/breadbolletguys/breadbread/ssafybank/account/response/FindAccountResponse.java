package com.breadbolletguys.breadbread.ssafybank.account.response;

import java.util.List;

import com.breadbolletguys.breadbread.ssafybank.account.dto.AccountProductDto;
import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record FindAccountResponse(
    SsafyBankRequestHeader Header,
    List<AccountProductDto> REC
) {
}
