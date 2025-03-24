package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.vendingmachine.domain.Space;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SpaceRepository {

    private final SpaceJdbcRepository spaceJdbcRepository;
    private final SpaceJpaRepository spaceJpaRepository;

    public void saveAll(List<Space> spaces) {
        spaceJdbcRepository.bulkInsert(spaces);
    }

    public List<Space> findByVendingMachineId(Long id) {
        return spaceJpaRepository.findAllByVendingMachineId(id);
    }

    public void deleteAll(List<Long> spaceIds) {
        spaceJpaRepository.deleteAll(spaceIds);
    }
}
