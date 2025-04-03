package com.breadbolletguys.breadbread.ssafybank.common.request;

import com.breadbolletguys.breadbread.ssafybank.common.domain.ApiName;
import com.breadbolletguys.breadbread.ssafybank.common.util.HeaderUtil;

import lombok.Builder;

@Builder
public record SsafyBankRequestHeader(
    String apiName,
    String transmissionDate,
    String transmissionTime,
    String institutionCode,
    String fintechAppNo,
    String apiServiceCode,
    String institutionTransactionUniqueNo,
    String apiKey,
    String userKey
) {
    public static SsafyBankRequestHeader of(ApiName apiName, String apiKey, String userKey) {
        return SsafyBankRequestHeader.builder()
            .apiName(apiName.getApiName())
            .transmissionDate(HeaderUtil.getCurrentDate())
            .transmissionTime(HeaderUtil.getCurrentTime())
            .institutionCode("00100")
            .fintechAppNo("001")
            .apiServiceCode(apiName.getApiName())
            .institutionTransactionUniqueNo(HeaderUtil.getInstitutionTransactionUniqueNo())
            .apiKey(apiKey)
            .userKey(userKey).build();
    }
}
