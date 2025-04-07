package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;

public interface VendingMachineJpaRepository
        extends JpaRepository<VendingMachine, Long>, VendingMachineQueryRepository {

    @Query("""
        SELECT vm
        FROM VendingMachine vm
        LEFT JOIN Space sp ON vm.id = sp.vendingMachineId
        lEFT JOIN Order o ON o.spaceId = sp.id
        WHERE o.id = :orderId
        """)
    Optional<VendingMachine> findByOrderId(Long orderId);

    @Query("""
        SELECT vm
        FROM VendingMachine vm
        LEFT JOIN Space sp ON vm.id = sp.vendingMachineId
        WHERE sp.id = :spaceId
        ORDER BY vm.id
        LIMIT 1
        """)
    Optional<VendingMachine> findBySpaceId(Long spaceId);
}
