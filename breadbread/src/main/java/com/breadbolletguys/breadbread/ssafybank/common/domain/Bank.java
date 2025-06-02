package com.breadbolletguys.breadbread.ssafybank.common.domain;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.BANK_CODE_NOT_EXIST_ERROR;

import java.util.Arrays;

import com.breadbolletguys.breadbread.common.exception.SsafyBankException;

import lombok.Getter;

@Getter
public enum Bank {
    KOREA_BANK("001", "한국은행"),
    DEVELOPMENT_BANK("002", "산업은행"),
    INDUSTRIAL_BANK("003", "기업은행"),
    NH_BANK("011", "농협은행"),
    WOORI_BANK("020", "우리은행"),
    SC_BANK("023", "SC제일은행"),
    DAEGU_BANK("032", "대구은행"),
    GWANGJU_BANK("034", "광주은행"),
    JEJU_BANK("035", "제주은행"),
    JEONBUK_BANK("037", "전북은행"),
    GYEONGNAM_BANK("039", "경남은행"),
    KFCCC_BANK("045", "새마을금고"),
    HANA_BANK("081", "KEB하나은행"),
    SINHAN_BANK("088", "신한은행"),
    KAKAO_BANK("090", "카카오뱅크"),
    SSAFY_BANK("999", "싸피은행");

    private final String bankCode;
    private final String bankName;

    Bank(final String bankCode, final String bankName) {
        this.bankCode = bankCode;
        this.bankName = bankName;
    }

    public Bank fromBankCode(final String bankCode) {
        return Arrays.asList(values())
            .stream()
            .filter(bank -> bank.bankCode.equals(bankCode))
            .findFirst()
            .orElseThrow(() -> new SsafyBankException(
                BANK_CODE_NOT_EXIST_ERROR.getCode(),
                BANK_CODE_NOT_EXIST_ERROR.getMessage()));
    }

    public Bank fromBankName(final String bankName) {
        return Arrays.asList(values())
            .stream()
            .filter(bank -> bank.bankName.equals(bankName))
            .findFirst()
            .orElseThrow(() -> new SsafyBankException(
                BANK_CODE_NOT_EXIST_ERROR.getCode(),
                BANK_CODE_NOT_EXIST_ERROR.getMessage()));
    }
}
