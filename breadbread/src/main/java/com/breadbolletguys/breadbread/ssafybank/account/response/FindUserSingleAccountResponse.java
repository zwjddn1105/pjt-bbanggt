package com.breadbolletguys.breadbread.ssafybank.account.response;

import com.breadbolletguys.breadbread.ssafybank.account.dto.UserAccountDto;
import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record FindUserSingleAccountResponse(
        SsafyBankRequestHeader Header,
        UserAccountDto REC
) {
}
