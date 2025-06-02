package com.breadbolletguys.breadbread.vendingmachine.domain.dto.request;

public record VendingMachineCreateJsonRequest(
        Double latitude,
        Double longitude,
        String address,
        int row,
        int column,
        String name
) {
}
