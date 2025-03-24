package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;

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

    public void increaseReview(Long bakeryid) {
        bakeryQueryRepository.increaseReview(bakeryid);
    }

    public void decreaseReview(Long bakeryId) {
        bakeryQueryRepository.decreaseReview(bakeryId);
    }
}
