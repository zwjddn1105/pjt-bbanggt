package com.breadbolletguys.breadbread.vendingmachine.domain.dto.response;

public record VendingMachineResponse(
        Long id,
        Double longitude,
        Double latitude,
        Double distance
) {
}
