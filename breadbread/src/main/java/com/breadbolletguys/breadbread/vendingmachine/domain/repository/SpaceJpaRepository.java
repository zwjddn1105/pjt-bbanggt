package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.breadbolletguys.breadbread.vendingmachine.domain.Space;

public interface SpaceJpaRepository extends JpaRepository<Space, Long> {
    List<Space> findAllByVendingMachineId(Long vendingMachineId);

    @Query("""
        UPDATE Space s
        SET s.deleted = true
        WHERE s.id in :ids
        """)
    @Modifying(clearAutomatically = true)
    void deleteAll(List<Long> ids);
}
