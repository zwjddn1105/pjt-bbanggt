package com.breadbolletguys.breadbread.order.domain.dto.response;

public record OrderCountQueryResponse(
        int count,
        Long vendingMachineId
) {
}
