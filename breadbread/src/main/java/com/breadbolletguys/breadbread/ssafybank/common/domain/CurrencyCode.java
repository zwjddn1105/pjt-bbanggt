package com.breadbolletguys.breadbread.ssafybank.common.domain;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.CURRENCY_CODE_NOT_EXIST_ERROR;

import java.util.Arrays;

import com.breadbolletguys.breadbread.common.exception.SsafyBankException;

public enum CurrencyCode {
    KOREA_KRW("KRW", "원화"),
    USA_USD("USD", "달러"),
    EUROPE_EUR("EUR", "유로"),
    JAPAN_JPY("JPY", "엔화"),
    CHINA_CHY("CNY", "위안화"),
    ENGLAND_GBP("GBP", "영국 파운드"),
    SWISS_CHF("CHF", "스위스 프랑"),
    CANADA_CAD("CAD", "캐나다 달러");

    private final String currency;
    private final String currencyName;

    CurrencyCode(final String currency, final String currencyName) {
        this.currency = currency;
        this.currencyName = currencyName;
    }

    public CurrencyCode fromCurrency(final String currency) {
        return Arrays.asList(values())
            .stream()
            .filter(currencyCode -> currencyCode.currency.equals(currency))
            .findFirst()
            .orElseThrow(() -> new SsafyBankException(
                CURRENCY_CODE_NOT_EXIST_ERROR.getCode(),
                CURRENCY_CODE_NOT_EXIST_ERROR.getMessage()));
    }

    public CurrencyCode fromCurrencyName(final String currencyName) {
        return Arrays.asList(values())
            .stream()
            .filter(bankCode -> bankCode.currencyName.equals(currencyName))
            .findFirst()
            .orElseThrow(() -> new SsafyBankException(
                CURRENCY_CODE_NOT_EXIST_ERROR.getCode(),
                CURRENCY_CODE_NOT_EXIST_ERROR.getMessage()));
    }
}
