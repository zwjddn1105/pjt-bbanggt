package com.breadbolletguys.breadbread.vendingmachine.application;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.vendingmachine.domain.Space;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.request.VendingMachineCreateJsonRequest;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.SpaceRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.VendingMachineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendingMachineService {

    private final VendingMachineRepository vendingMachineRepository;
    private final SpaceRepository spaceRepository;

    @Transactional
    public Long save(
            VendingMachineCreateJsonRequest request,
            List<String> vendingMachineImageUrls
    ) {
        validatePosition(request.latitude(), request.longitude());

        VendingMachine vendingMachine = VendingMachine.builder()
                .height(request.row())
                .width(request.column())
                .imageUrls(vendingMachineImageUrls)
                .memo(request.memo())
                .longitude(request.longitude())
                .latitude(request.latitude())
                .build();

        vendingMachineRepository.save(vendingMachine);

        List<Space> spaces = new ArrayList<>();
        for (int row = 0; row < request.row(); row++) {
            for (int column = 0; column < request.column(); column++) {
                spaces.add(Space.builder()
                        .width(column)
                        .height(row)
                        .vendingMachineId(vendingMachine.getId())
                        .deleted(false)
                        .build());
            }
        }

        spaceRepository.saveAll(spaces);
        return vendingMachine.getId();
    }

    @Transactional
    public void delete(Long id) {
        if (!vendingMachineRepository.existsById(id)) {
            throw new BadRequestException(NOT_FOUND_VENDING_MACHINE);
        }

        List<Space> spaces = spaceRepository.findByVendingMachineId(id);
        validateCanRemove(spaces);

        List<Long> spaceIds = convertToSpaceIds(spaces);

        spaceRepository.deleteAll(spaceIds);
        vendingMachineRepository.delete(id);
    }

    private List<Long> convertToSpaceIds(List<Space> spaces) {
        return spaces.stream()
                .map(Space::getId)
                .toList();
    }

    /**
     * 사용중인 칸이 존재하면 자판기를 삭제할 수 없다.
     */
    private void validateCanRemove(List<Space> spaces) {
        for (Space space : spaces) {
            if (space.isOccupied()) {
                throw new BadRequestException(CANT_REMOVE_OCCUPIED_VENDING_MACHINE);
            }
        }
    }

    /**
     * 자판기의 위경도를 입력받아 유효한 위치인지 검증한다.
     */
    private void validatePosition(Double latitude, Double longitude) {
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            throw new BadRequestException(INVALID_GEO_COORDINATES);
        }
    }
}
