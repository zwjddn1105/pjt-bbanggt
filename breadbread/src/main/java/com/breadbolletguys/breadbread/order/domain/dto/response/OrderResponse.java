package com.breadbolletguys.breadbread.order.domain.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private String bakeryName;
    private String name;
    private int price;
    private int count;
    private LocalDateTime expirationDate;
}
