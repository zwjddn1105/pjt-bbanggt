package com.breadbolletguys.breadbread.common.exception;

public class ValidException extends BadRequestException {

    public ValidException(String message) {
        super(ErrorCode.VALIDATION_FAIL);
    }
}
