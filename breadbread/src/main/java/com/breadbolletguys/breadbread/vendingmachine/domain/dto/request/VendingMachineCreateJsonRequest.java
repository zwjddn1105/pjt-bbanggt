package com.breadbolletguys.breadbread.vendingmachine.domain.dto.request;

public record VendingMachineCreateJsonRequest(
        Double latitude,
        Double longitude,
        String memo,
        int row,
        int column,
        String name
) {
}
