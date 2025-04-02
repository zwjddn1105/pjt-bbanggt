package com.breadbolletguys.breadbread.vendingmachine.domain;

import lombok.Builder;
import lombok.Getter;

@Getter
public class VendingMachineRedisEntity {
    private String id;
    private String name;
    private String address;
    private int remainSpaceCount;

    @Builder
    public VendingMachineRedisEntity(String id, String name, String address, int remainSpaceCount) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.remainSpaceCount = remainSpaceCount;
    }
}
