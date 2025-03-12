package com.breadbolletguys.breadbread.common.exception;

public class NotFoundException extends BadRequestException {

    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
}
