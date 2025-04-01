package com.breadbolletguys.breadbread.common.exception;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SsafyApiExceptionResponse(
    @JsonProperty("Header") Header header
) {
    public record Header(
        @JsonProperty("responseCode") String responseCode,
        @JsonProperty("responseMessage") String responseMessage
    ) {

    }
}
