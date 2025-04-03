package com.breadbolletguys.breadbread.vendingmachine.domain.dto.response;

public record VendingMachineResponse(
        String id,
        String name,
        String address,
        int remainSpaceCount,
        int availableCount,
        Double longitude,
        Double latitude,
        Double distance
) {
}
