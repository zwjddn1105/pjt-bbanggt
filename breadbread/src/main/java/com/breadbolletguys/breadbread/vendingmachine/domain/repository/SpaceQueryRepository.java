package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SpaceCountQueryResponse;

public interface SpaceQueryRepository {
    List<SpaceCountQueryResponse> findSpaceCountsByVendingMachineIds(List<Long> vendingMachineIds);
}
