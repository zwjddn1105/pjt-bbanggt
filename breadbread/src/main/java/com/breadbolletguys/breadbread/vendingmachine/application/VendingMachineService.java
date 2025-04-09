package com.breadbolletguys.breadbread.vendingmachine.application;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.ProductState;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderSummaryResponse;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.repository.BookmarkRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.Space;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachineRedisEntity;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.request.VendingMachineCreateJsonRequest;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SlotBuyerResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SlotSellerResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.StackSummaryResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineBuyerResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineSellerResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.SpaceRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.VendingMachineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendingMachineService {

    private final VendingMachineRepository vendingMachineRepository;
    private final SpaceRepository spaceRepository;
    private final OrderRepository orderRepository;
    private final BookmarkRepository bookmarkRepository;
    private final BakeryRepository bakeryRepository;

    @Transactional
    public VendingMachine save(
            VendingMachineCreateJsonRequest request,
            List<String> vendingMachineImageUrls
    ) {
        validatePosition(request.latitude(), request.longitude());

        VendingMachine vendingMachine = VendingMachine.builder()
                .height(request.row())
                .width(request.column())
                .imageUrls(vendingMachineImageUrls)
                .address(request.address())
                .longitude(request.longitude())
                .latitude(request.latitude())
                .name(request.name())
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
        return vendingMachine;
    }

    @Transactional
    public VendingMachineRedisEntity delete(Long id) {
        VendingMachine vendingMachine = vendingMachineRepository.findById(id)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_VENDING_MACHINE));

        List<Space> spaces = spaceRepository.findByVendingMachineId(id);
        validateCanRemove(spaces);

        List<Long> spaceIds = convertToSpaceIds(spaces);

        spaceRepository.deleteAll(spaceIds);
        vendingMachineRepository.delete(id);

        return VendingMachineRedisEntity.builder()
                .address(vendingMachine.getAddress())
                .name(vendingMachine.getName())
                .id(vendingMachine.getId().toString())
                .build();
    }

    public VendingMachineBuyerResponse findVendingMachineForBuyer(User user, Long id) {
        VendingMachine vendingMachine = vendingMachineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(NOT_FOUND_VENDING_MACHINE));
        List<Space> spaces = spaceRepository.findByVendingMachineId(id);

        List<SlotBuyerResponse> slotResponses = new ArrayList<>();

        for (int i = 0; i < spaces.size(); i++) {
            Space space = spaces.get(i);
            Optional<Order> orderOpt =
                    orderRepository.findBySpaceIdAndProductState(space.getId(), ProductState.AVAILABLE);

            OrderSummaryResponse orderSummaryResponse = orderOpt.map(order -> {
                Bakery bakery = bakeryRepository.findById(order.getBakeryId())
                        .orElseThrow(() -> new NotFoundException(BAKERY_NOT_FOUND));
                boolean isMark = bookmarkRepository.existsByUserIdAndBakeryId(user.getId(), order.getBakeryId());
                return new OrderSummaryResponse(
                        order.getId(),
                        bakery.getId(),
                        bakery.getName(),
                        order.getBreadType(),
                        isMark,
                        order.getProductState()
                );
            }).orElse(null);

            slotResponses.add(new SlotBuyerResponse(i + 1, orderSummaryResponse));
        }

        return new VendingMachineBuyerResponse(
                vendingMachine.getName(),
                vendingMachine.getHeight(),
                vendingMachine.getWidth(),
                slotResponses
        );

    }

    public VendingMachineSellerResponse findVendingMachineForSeller(User user, Long id) {
        VendingMachine vendingMachine = vendingMachineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(NOT_FOUND_VENDING_MACHINE));
        List<Space> spaces = spaceRepository.findByVendingMachineId(id);

        List<SlotSellerResponse> slotSellerResponses = new ArrayList<>();
        for (int i = 0; i < spaces.size(); i++) {
            Space space = spaces.get(i);
            boolean isMine = space.getSellerId() != null && space.getSellerId().equals(user.getId());
            Optional<Order> orderOpt =
                    orderRepository.findFirstBySpaceIdAndProductStateIn(
                            space.getId(),
                            List.of(ProductState.AVAILABLE, ProductState.SOLD_OUT)
                    );
            StackSummaryResponse stackSummaryResponse = orderOpt
                    .map(order -> new StackSummaryResponse(order.getId()))
                    .orElse(null);
            slotSellerResponses.add(
                    new SlotSellerResponse(space.getId(),
                            i + 1,
                            stackSummaryResponse,
                            isMine)
            );
        }

        return new VendingMachineSellerResponse(
                vendingMachine.getName(),
                vendingMachine.getHeight(),
                vendingMachine.getWidth(),
                slotSellerResponses
        );
    }

    public VendingMachine findBySpaceId(Long spaceId) {
        return vendingMachineRepository.findBySpaceId(spaceId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_VENDING_MACHINE));
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
