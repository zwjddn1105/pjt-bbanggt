package com.breadbolletguys.breadbread.ssafybank.transfer.response;

import java.util.List;

import com.breadbolletguys.breadbread.ssafybank.common.response.SsafyBankResponseHeader;
import com.breadbolletguys.breadbread.ssafybank.transfer.dto.TransactionSpecificDto;

public record AccountTransferSsafyApiResponse(
    SsafyBankResponseHeader Header,
    List<TransactionSpecificDto> REC
) {
}
