package com.breadbolletguys.breadbread.account.domain;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.MINUS_BALANCE_ERROR;

import jakarta.persistence.Embeddable;

import com.breadbolletguys.breadbread.common.exception.BadRequestException;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Balance {
    private Long balance;

    public Balance(Long balance) {
        validateBalance(balance);
        this.balance = balance;
    }

    private void validateBalance(Long balance) {
        if (balance < 0) {
            throw new BadRequestException(MINUS_BALANCE_ERROR);
        }
    }
}
