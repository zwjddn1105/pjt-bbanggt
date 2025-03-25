package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineGeoResponse;

public interface VendingMachineQueryRepository {
    List<VendingMachineGeoResponse> findAllGeoInfo();
}
