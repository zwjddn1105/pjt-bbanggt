package com.breadbolletguys.breadbread.bakery.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BakeryResponse {
    private Long id;
    private String name;
    private String homepageUrl;
    private String address;
    private String phone;
    private boolean isMark;

    public void updateMark(boolean isMark) {
        this.isMark = isMark;
    }
}
