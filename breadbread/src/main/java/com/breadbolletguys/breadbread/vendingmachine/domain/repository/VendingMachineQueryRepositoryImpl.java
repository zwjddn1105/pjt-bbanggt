package com.breadbolletguys.breadbread.vendingmachine.domain.repository;

import static com.breadbolletguys.breadbread.vendingmachine.domain.QVendingMachine.vendingMachine;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineGeoResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VendingMachineQueryRepositoryImpl implements VendingMachineQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<VendingMachineGeoResponse> findAllGeoInfo() {
        return queryFactory.select(
                Projections.constructor(
                    VendingMachineGeoResponse.class,
                        vendingMachine.id,
                        vendingMachine.longitude,
                        vendingMachine.latitude
                )).from(vendingMachine)
                .where(vendingMachine.deleted.eq(false))
                .fetch();
    }
}
