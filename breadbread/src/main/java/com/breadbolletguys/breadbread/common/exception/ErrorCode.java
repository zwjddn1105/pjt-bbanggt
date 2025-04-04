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
    BAKERY_NOT_FOUND(1005, "요청 ID에 해당하는 빵집이 존재하지 않습니다."),
    REVIEW_NOT_FOUND(1006, "요청 ID에 해당하는 리뷰가 존재하지 않습니다."),
    ORDER_NOT_FOUND(1007, "요청 ID에 해당하는 빵이 존재하지 않습니다."),
    ALREADY_FOLLOWED(1008, "이미 팔로우 되어 요청 오류가 발생했습니다."),
    ALREADY_REQUESTED(1009, "이미 팔로우 요청 되어 오류가 발생했습니다."),
    UNABLE_TO_REFUND_PRODUCT(10010, "해당 상태의 빵은 환불할 수 없습니다."),
    UNABLE_TO_PURCHASE_PRODUCT(10011, "해당 상태의 빵은 결제할 수 없습니다."),
    DUPLICATE_BOOKMARK(10012, "이미 북마크한 빵집입니다."),
    BOOKMARK_NOT_FOUND(10013, "북마크가 존재하지 않습니다."),
    ALREADY_SELLER(10014, "이미 판매자입니다."),
    NOT_SELLER(10015, "판매자가 아닙니다."),

    UNABLE_TO_GET_USER_INFO(2001, "소셜 로그인 공급자로부터 유저 정보를 받아올 수 없습니다."),
    UNABLE_TO_GET_ACCESS_TOKEN(2002, "소셜 로그인 공급자로부터 인증 토큰을 받아올 수 없습니다."),
    NOT_SOCIAL_USER(2003, "소셜 로그인 유저가 아닙니다."),
    NOT_NONE_SOCIAL_USER(2004, "일반 로그인 유저가 아닙니다."),
    NOT_ADMIN_USER(2005, "관리자 권한이 없습니다."),
    UNABLE_TO_USE_TICKET(2006, "티켓 잔고가 없어 사용이 불가합니다"),

    UNAUTHORIZED_ACCESS(3000, "접근할 수 없는 리소스입니다."),
    INVALID_REFRESH_TOKEN(3001, "유효하지 않은 Refresh Token입니다."),
    FAILED_TO_VALIDATE_TOKEN(3002, "토큰 검증에 실패했습니다."),
    INVALID_ACCESS_TOKEN(3003, "유효하지 않은 Access Token입니다."),
    FORBIDDEN_ORDER_ACCESS(3004, "해당 주문에 대한 접근 권한이 없습니다."),

    VALIDATION_FAIL(4000, "유효하지 않은 형식입니다."),
    INTERNAL_SERVER_ERROR(4001, "Internal Server Error"),

    MINUS_BALANCE_ERROR(5000, "잔고에 음수가 들어올 수 없습니다."),
    MINUS_REVIEW_ERROR(5001, "리뷰에 음수가 들어올 수 없습니다."),
    CURRENCY_CODE_NOT_EXIST_ERROR(5002, "해당 유형의 통화는 사용할 수 없습니다."),
    BANK_CODE_NOT_EXIST_ERROR(5003, "해당 유형의 은행은 존재하지 않습니다."),
    NOT_OWNED_ACCOUNT_ERROR(5004, "요청한 계좌는 사용자 소유가 아닙니다."),

    SCORE_RANGE_ERROR(6000, "리뷰 점수의 범위는 1-5점입니다."),

    INVALID_GEO_COORDINATES(7000, "유효하지 않은 위경도 범위입니다."),

    CANT_REMOVE_OCCUPIED_VENDING_MACHINE(8000, "사용중인 자판기는 삭제할 수 없습니다."),
    NOT_FOUND_VENDING_MACHINE(8001, "해당 자판기를 찾을 수 없습니다."),
    NOT_FOUND_SPACE(8002, "해당 칸을 찾을 수 없습니다."),
    ALREADY_PURCHASED_SPACE(8003, "이미 구매된 칸입니다."),

    FILE_UPLOAD_FAILED(9000, "파일 업로드에 실패했습니다. 다시 시도해 주세요."),

    NOT_FOUND_CHAT_ROOM(10000, "해당 문의 채팅방이 존재하지 않습니다."),
    USER_NOT_IN_CHAT_ROOM(10001, "문의방에 존재하지 않는 유저입니다."),
    ALREADY_EXIST_CHAT_ROOM_BETWEEN_OWNER_AND_CUSTOMER(10002, "이미 둘 사이에 문의채팅방이 존재합니다."),

    ACCOUNT_NOT_FOUND(11000, "요청 UserID에 해당하는 계좌가 존재하지 않습니다."),

    Transaction_NOT_FOUND(12000, "요청 OrderID에 해당하는 거래 내역이 존재하지 않습니다."),
    REFUND_TIME_EXCEEDED(12001, "환불 시간이 불가능한 상품입니다.");

    private final int code;
    private final String message;
}

