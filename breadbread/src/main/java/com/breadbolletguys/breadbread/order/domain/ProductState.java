package com.breadbolletguys.breadbread.order.domain;

/**
 * AVAILABLE : 판매 중
 * RESERVED : 선점됨
 * SOLD_OUT : 판매 완료
 * EXPIRED : 유통기한 지남
 */
public enum ProductState {
    AVAILABLE, SOLD_OUT, EXPIRED
}
