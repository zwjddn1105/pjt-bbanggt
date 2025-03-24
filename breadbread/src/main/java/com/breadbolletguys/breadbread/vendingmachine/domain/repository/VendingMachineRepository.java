package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;

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
}
