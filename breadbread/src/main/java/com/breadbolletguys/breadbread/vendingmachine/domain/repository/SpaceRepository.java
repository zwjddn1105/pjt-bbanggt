package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.vendingmachine.domain.Space;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SpaceCountQueryResponse;

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

    public Optional<Space> findById(Long spaceId) {
        return spaceJpaRepository.findById(spaceId);
    }

    public Space save(Space space) {
        return spaceJpaRepository.save(space);
    }

    public int countNotOccupiedSpaceByVendingMachineId(Long id) {
        return spaceJpaRepository.countNotOccupiedSpaceByVendingMachineId(id);
    }

    public List<SpaceCountQueryResponse> findSpaceCountsByVendingMachineIds(List<Long> vendingMachineIds) {
        return spaceJpaRepository.findSpaceCountsByVendingMachineIds(vendingMachineIds);
    }
}
