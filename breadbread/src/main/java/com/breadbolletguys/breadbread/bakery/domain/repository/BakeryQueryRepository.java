package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;

public interface BakeryQueryRepository {

    BakeryResponse findBakeryBaseInfo(Long bakeryId);

    List<BakeryResponse> findBakeryBaseInfos(List<Long> bakeryIds);
}
