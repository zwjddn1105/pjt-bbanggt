package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;

import lombok.RequiredArgsConstructor;


@Repository
@RequiredArgsConstructor
public class BakeryRepository {
    private final BakeryJpaRepository bakeryJpaRepository;
    private final BakeryQueryRepository bakeryQueryRepository;

    public Optional<Bakery> findById(Long bakeryId) {
        return bakeryJpaRepository.findById(bakeryId);
    }

    public void save(Bakery bakery) {
        bakeryJpaRepository.save(bakery);
    }

    public BakeryResponse findBakeryBaseInfo(Long bakeryId) {
        return bakeryQueryRepository.findBakeryBaseInfo(bakeryId);
    }

    public Optional<Bakery> findByUserId(Long userId) {
        return bakeryJpaRepository.findByUserId(userId);
    }

    public List<BakeryResponse> findBakeryBaseInfos(List<Long> bakeryIds) {
        return bakeryQueryRepository.findBakeryBaseInfos(bakeryIds);
    }
}
