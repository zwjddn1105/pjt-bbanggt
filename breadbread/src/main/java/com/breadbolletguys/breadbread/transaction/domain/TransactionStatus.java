package com.breadbolletguys.breadbread.transaction.domain;

/**
 * PURCHASE : 구매
 * CANCELED : 주문 취소
 * REFUND : 환불
 * SETTLE : 정산
 */
public enum TransactionStatus {
    PURCHASE, CANCELED, REFUND, SETTLED
}
