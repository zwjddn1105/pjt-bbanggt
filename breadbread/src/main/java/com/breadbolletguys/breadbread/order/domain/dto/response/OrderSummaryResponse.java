package com.breadbolletguys.breadbread.order.domain.dto.response;

import java.util.List;

import com.breadbolletguys.breadbread.order.domain.BreadType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderSummaryResponse {
    private Long id;
    private int slotNumber;
    private List<BreadType> breadTypes;
}
