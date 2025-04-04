package com.breadbolletguys.breadbread.order.domain.dto.response;

import com.breadbolletguys.breadbread.order.domain.ProductState;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderStackResponse {
    private Long id;
    private String memo;
    private int count;
    private ProductState productState;
}
