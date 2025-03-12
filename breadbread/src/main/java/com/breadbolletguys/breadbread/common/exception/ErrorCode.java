package com.breadbolletguys.breadbread.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    INVALID_REQUEST(1000, "유효하지 않은 요청입니다."),
    DUPLICATE_FOLLOW_REQUEST(1001, "중복 팔로우 요청은 불가합니다."),
    USER_NOT_FOUND(1002, "요청 ID에 해당하는 유저가 존재하지 않습니다."),
    FOLLOW_REQUEST_NOT_FOUND(1003, "요청 ID에 해당하는 팔로우 요청이 존재하지 않습니다."),
    FOLLOW_HISTORY_NOT_FOUND(1004, "요청의 기록을 찾을 수 없습니다."),
    ALREADY_FOLLOWED(1008, "이미 팔로우 되어 요청 오류가 발생했습니다."),
    ALREADY_REQUESTED(1009, "이미 팔로우 요청 되어 오류가 발생했습니다."),

    UNABLE_TO_GET_USER_INFO(2001, "소셜 로그인 공급자로부터 유저 정보를 받아올 수 없습니다."),
    UNABLE_TO_GET_ACCESS_TOKEN(2002, "소셜 로그인 공급자로부터 인증 토큰을 받아올 수 없습니다."),
    NOT_SOCIAL_USER(2003, "소셜 로그인 유저가 아닙니다."),
    NOT_NONE_SOCIAL_USER(2004, "일반 로그인 유저가 아닙니다."),

    UNAUTHORIZED_ACCESS(3000, "접근할 수 없는 리소스입니다."),
    INVALID_REFRESH_TOKEN(3001, "유효하지 않은 Refresh Token입니다."),
    FAILED_TO_VALIDATE_TOKEN(3002, "토큰 검증에 실패했습니다."),
    INVALID_ACCESS_TOKEN(3003, "유효하지 않은 Access Token입니다."),

    VALIDATION_FAIL(4000, "유효하지 않은 형식입니다."),
    INTERNAL_SERVER_ERROR(4001, "Internal Server Error"),

    MINUS_BALANCE_ERROR(5000, "잔고에 음수가 들어올 수 없습니다."),

    SCORE_RANGE_ERROR(6000, "리뷰 점수의 범위는 1-5점입니다.");

    private final int code;
    private final String message;
}
