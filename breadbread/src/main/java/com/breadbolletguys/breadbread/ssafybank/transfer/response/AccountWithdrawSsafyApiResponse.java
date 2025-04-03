package com.breadbolletguys.breadbread.ssafybank.transfer.response;

import com.breadbolletguys.breadbread.ssafybank.common.response.SsafyBankResponseHeader;
import com.breadbolletguys.breadbread.ssafybank.transfer.dto.TransactionDto;

public record AccountWithdrawSsafyApiResponse(
    SsafyBankResponseHeader Header,
    TransactionDto REC
) {
}
