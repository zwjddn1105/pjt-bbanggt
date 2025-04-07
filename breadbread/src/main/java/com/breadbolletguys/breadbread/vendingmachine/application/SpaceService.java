package com.breadbolletguys.breadbread.vendingmachine.application;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.*;

import org.springframework.stereotype.Service;

import com.breadbolletguys.breadbread.common.annotation.RedisLock;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.vendingmachine.domain.Space;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachineRedisEntity;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.SpaceRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.VendingMachineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final VendingMachineRepository vendingMachineRepository;
    private final VendingMachineCacheService vendingMachineCacheService;
    private final OrderRepository orderRepository;

    @RedisLock(key = "'spaceId:' + #spaceId")
    public void save(User user, Long spaceId) {
        if (!user.isSeller()) {
            throw new BadRequestException(NOT_SELLER);
        }

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_SPACE));

        if (space.isOccupied()) {
            throw new BadRequestException(ALREADY_PURCHASED_SPACE);
        }

        VendingMachine vendingMachine = vendingMachineRepository.findById(space.getVendingMachineId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_VENDING_MACHINE));
        int remainSpaceCount = spaceRepository.countNotOccupiedSpaceByVendingMachineId(vendingMachine.getId());
        int availableCount = orderRepository.countAvailableOrderByVendingMachineId(vendingMachine.getId());

        var vendingMachineDeleteRedisEntity = VendingMachineRedisEntity.builder()
                .id(vendingMachine.getId().toString())
                .address(vendingMachine.getAddress())
                .name(vendingMachine.getName())
                .remainSpaceCount(remainSpaceCount)
                .availableCount(availableCount)
                .build();

        user.useTickets();
        space.buy(user.getId());
        spaceRepository.save(space);

        vendingMachineCacheService.delete(vendingMachineDeleteRedisEntity);
        vendingMachineCacheService.save(vendingMachine);

        // TODO: 계좌 이체 Seller -> Admin 계좌로
    }
}