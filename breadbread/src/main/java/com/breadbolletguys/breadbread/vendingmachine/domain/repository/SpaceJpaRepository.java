package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.breadbolletguys.breadbread.vendingmachine.domain.Space;


public interface SpaceJpaRepository extends JpaRepository<Space, Long>, SpaceQueryRepository {
    List<Space> findAllByVendingMachineId(Long vendingMachineId);

    @Query("""
        UPDATE Space s
        SET s.deleted = true
        WHERE s.id in :ids
        """)
    @Modifying(clearAutomatically = true)
    void deleteAll(List<Long> ids);

    @Query("""
        SELECT COUNT(*)
        FROM Space s
        WHERE s.vendingMachineId = :vendingMachineId
        AND s.occupied = false
        """)
    int countNotOccupiedSpaceByVendingMachineId(@Param("vendingMachineId") Long vendingMachineId);

    @Query("SELECT s.vendingMachineId FROM Space s WHERE s.id IN :spaceIds")
    List<Long> findVendingMachineIdsBySpaceIds(@Param("spaceIds") List<Long> spaceIds);
}
