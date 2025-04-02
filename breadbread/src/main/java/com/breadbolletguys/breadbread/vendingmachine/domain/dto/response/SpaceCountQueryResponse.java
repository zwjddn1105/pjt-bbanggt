package com.breadbolletguys.breadbread.vendingmachine.domain.dto.response;

public record SpaceCountQueryResponse(
        int count,
        Long vendingMachineId
) {
}
