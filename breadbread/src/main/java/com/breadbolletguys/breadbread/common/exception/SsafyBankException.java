package com.breadbolletguys.breadbread.common.exception;

import lombok.Getter;

@Getter
public class SsafyBankException extends RuntimeException {
    private int code;
    private String message;

    public SsafyBankException(final int code, final String message) {
        this.code = code;
        this.message = message;
    }
}
