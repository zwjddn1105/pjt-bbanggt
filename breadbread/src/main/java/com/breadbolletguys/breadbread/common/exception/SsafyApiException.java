package com.breadbolletguys.breadbread.common.exception;

import lombok.Getter;

@Getter
public class SsafyApiException extends RuntimeException {
    private String code;
    private String message;

    public SsafyApiException(final String code, final String message) {
        this.code = code;
        this.message = message;
    }
}
