package com.breadbolletguys.breadbread.ssafybank.account.request;

import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;

public record SingleAccountSsafyApiRequest(
        SsafyBankRequestHeader Header,
        String accountNo
) {
}
