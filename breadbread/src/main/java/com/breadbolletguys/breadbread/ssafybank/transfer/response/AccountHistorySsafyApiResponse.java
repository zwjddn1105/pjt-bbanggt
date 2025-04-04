package com.breadbolletguys.breadbread.ssafybank.transfer.response;

import com.breadbolletguys.breadbread.ssafybank.common.response.SsafyBankResponseHeader;
import com.breadbolletguys.breadbread.ssafybank.transfer.dto.TransactionHistoryDto;

public record AccountHistorySsafyApiResponse(
    SsafyBankResponseHeader Header,
    TransactionHistoryDto REC
) {
}
