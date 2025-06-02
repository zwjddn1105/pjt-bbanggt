package com.breadbolletguys.breadbread.ssafybank.account.response;

import java.util.List;

import com.breadbolletguys.breadbread.ssafybank.account.dto.UserAccountDto;
import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record FindUserAccountResponse(
    SsafyBankRequestHeader Header,
    List<UserAccountDto> REC
) {
}
