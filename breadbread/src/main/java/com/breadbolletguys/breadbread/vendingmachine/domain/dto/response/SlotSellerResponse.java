package com.breadbolletguys.breadbread.vendingmachine.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SlotSellerResponse {
    private Long spaceId;
    private int slotNumber;
    private StackSummaryResponse stackSummaryResponse;
    private boolean isOcucupied;
    private boolean isMine;
}
