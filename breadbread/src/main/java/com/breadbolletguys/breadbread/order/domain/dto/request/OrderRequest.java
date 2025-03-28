package com.breadbolletguys.breadbread.order.domain.dto.request;

import java.time.LocalDateTime;

import com.breadbolletguys.breadbread.order.domain.BreadType;
import com.breadbolletguys.breadbread.order.domain.ProductState;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private int price;
    private int count;
    private int discount;
    private BreadType breadType;
}
