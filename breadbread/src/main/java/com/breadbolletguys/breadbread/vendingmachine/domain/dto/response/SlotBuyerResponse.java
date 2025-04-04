package com.breadbolletguys.breadbread.vendingmachine.domain.dto.response;

import com.breadbolletguys.breadbread.order.domain.dto.response.OrderSummaryResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SlotBuyerResponse {
    private int slotNumber;
    private OrderSummaryResponse orderSummaryResponse;
}
