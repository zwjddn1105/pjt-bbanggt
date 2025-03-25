package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineGeoResponse;

import lombok.RequiredArgsConstructor;


@Repository
@RequiredArgsConstructor
public class VendingMachineRepository {

    private final VendingMachineJpaRepository vendingMachineJpaRepository;

    public VendingMachine save(VendingMachine vendingMachine) {
        return vendingMachineJpaRepository.save(vendingMachine);
    }

    public void delete(Long id) {
        vendingMachineJpaRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return vendingMachineJpaRepository.existsById(id);
    }

    public List<VendingMachineGeoResponse> findAllGeoInfo() {
        return vendingMachineJpaRepository.findAllGeoInfo();
    }
}
