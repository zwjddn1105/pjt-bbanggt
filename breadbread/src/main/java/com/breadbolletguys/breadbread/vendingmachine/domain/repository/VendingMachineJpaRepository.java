package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;

public interface VendingMachineJpaRepository
        extends JpaRepository<VendingMachine, Long>, VendingMachineQueryRepository {
}
