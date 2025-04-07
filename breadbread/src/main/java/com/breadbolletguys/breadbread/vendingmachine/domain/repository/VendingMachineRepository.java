package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;
import java.util.Optional;

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

    public Optional<VendingMachine> findById(Long id) {
        return vendingMachineJpaRepository.findById(id);
    }

    public List<VendingMachine> findAll() {
        return vendingMachineJpaRepository.findAll();
    }

    public Optional<VendingMachine> findByOrderId(Long orderId) {
        return vendingMachineJpaRepository.findByOrderId(orderId);
    }
}
