package com.breadbolletguys.breadbread.vendingmachine.domain.dto.response;

public record VendingMachineGeoResponse(
        Long id,
        Double longitude,
        Double latitude
) {
}
