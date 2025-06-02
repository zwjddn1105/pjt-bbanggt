package com.breadbolletguys.breadbread.bakery.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BakeryRequest {
    private String name;
    private String businessNumber;
    private String address;
}
