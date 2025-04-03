package com.breadbolletguys.breadbread.vendingmachine.domain.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VendingMachineSlotResponse {
    private String vendingMachineName;
    private int height;
    private int width;
    private List<SlotResponse> slotResponseList;
}
