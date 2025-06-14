package com.breadbolletguys.breadbread.vendingmachine.application;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.stereotype.Service;

import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.util.JsonUtil;
import com.breadbolletguys.breadbread.order.domain.dto.response.OrderCountQueryResponse;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.repository.BookmarkRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachineRedisEntity;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.SpaceCountQueryResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.SpaceRepository;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.VendingMachineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendingMachineCacheService {

    private static final String VENDING_MACHINE_KEY = "vending-machine";

    private final GeoOperations<String, String> geoOperations;
    private final VendingMachineRepository vendingMachineRepository;
    private final SpaceRepository spaceRepository;
    private final BookmarkRepository bookmarkRepository;
    private final OrderRepository orderRepository;
    private final JsonUtil jsonUtil;

    public void deleteByOrderId(Long orderId) {
        VendingMachine vendingMachine = vendingMachineRepository.findByOrderId(orderId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.NOT_FOUND_VENDING_MACHINE));
        int remainSpaceCount = spaceRepository.countNotOccupiedSpaceByVendingMachineId(vendingMachine.getId());
        int availableCount = orderRepository.countAvailableOrderByVendingMachineId(vendingMachine.getId());

        var vendingMachineDeleteRedisEntity = VendingMachineRedisEntity.builder()
                .id(vendingMachine.getId().toString())
                .address(vendingMachine.getAddress())
                .name(vendingMachine.getName())
                .remainSpaceCount(remainSpaceCount)
                .availableCount(availableCount)
                .build();

        geoOperations.remove(VENDING_MACHINE_KEY, jsonUtil.convertToJson(vendingMachineDeleteRedisEntity));
    }

    public void save(VendingMachine vendingMachine) {
        Point point = new Point(vendingMachine.getLongitude(), vendingMachine.getLatitude());
        int remainSpaceCount = spaceRepository.countNotOccupiedSpaceByVendingMachineId(vendingMachine.getId());
        int availableCount = orderRepository.countAvailableOrderByVendingMachineId(vendingMachine.getId());

        var vendingMachineRedisEntity = VendingMachineRedisEntity.builder()
                .id(vendingMachine.getId().toString())
                .address(vendingMachine.getAddress())
                .name(vendingMachine.getName())
                .remainSpaceCount(remainSpaceCount)
                .availableCount(availableCount)
                .build();

        geoOperations.add(VENDING_MACHINE_KEY, point, jsonUtil.convertToJson(vendingMachineRedisEntity));
    }

    public void deleteBySpaceId(Long spaceId) {
        VendingMachine vendingMachine = vendingMachineRepository.findBySpaceId(spaceId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.NOT_FOUND_VENDING_MACHINE));

        int remainSpaceCount = spaceRepository.countNotOccupiedSpaceByVendingMachineId(vendingMachine.getId());
        int availableCount = orderRepository.countAvailableOrderByVendingMachineId(vendingMachine.getId());

        var vendingMachineDeleteRedisEntity = VendingMachineRedisEntity.builder()
                .id(vendingMachine.getId().toString())
                .address(vendingMachine.getAddress())
                .name(vendingMachine.getName())
                .remainSpaceCount(remainSpaceCount)
                .availableCount(availableCount)
                .build();

        geoOperations.remove(VENDING_MACHINE_KEY, jsonUtil.convertToJson(vendingMachineDeleteRedisEntity));
    }

    public void delete(VendingMachineRedisEntity vendingMachineRedisEntity) {
        geoOperations.remove(VENDING_MACHINE_KEY, jsonUtil.convertToJson(vendingMachineRedisEntity));
    }

    public void save(Long orderId) {
        VendingMachine vendingMachine = vendingMachineRepository.findByOrderId(orderId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.NOT_FOUND_VENDING_MACHINE));

        Point point = new Point(vendingMachine.getLongitude(), vendingMachine.getLatitude());
        int remainSpaceCount = spaceRepository.countNotOccupiedSpaceByVendingMachineId(vendingMachine.getId());
        int availableCount = orderRepository.countAvailableOrderByVendingMachineId(vendingMachine.getId());

        var vendingMachineRedisEntity = VendingMachineRedisEntity.builder()
                .id(vendingMachine.getId().toString())
                .address(vendingMachine.getAddress())
                .name(vendingMachine.getName())
                .remainSpaceCount(remainSpaceCount)
                .availableCount(availableCount)
                .build();

        geoOperations.add(VENDING_MACHINE_KEY, point, jsonUtil.convertToJson(vendingMachineRedisEntity));
    }

    public List<VendingMachineResponse> findNearByVendingMachine(
            Double longitude,
            Double latitude,
            Integer distance
    ) {
        Distance radius = new Distance(distance, Metrics.KILOMETERS);
        Circle circle = new Circle(new Point(longitude, latitude), radius);

        var args = RedisGeoCommands.GeoRadiusCommandArgs
                .newGeoRadiusArgs()
                .includeCoordinates()
                .includeDistance();
        var result = geoOperations.radius(VENDING_MACHINE_KEY, circle, args);

        return result.getContent().stream()
                .map(geoResult -> {
                    var location = geoResult.getContent();
                    var distanceVal = geoResult.getDistance();
                    var vendingMachineRedisEntity = jsonUtil.convertToObject(
                            location.getName(),
                            VendingMachineRedisEntity.class
                    );
                    return new VendingMachineResponse(
                            vendingMachineRedisEntity.getId(),
                            vendingMachineRedisEntity.getName(),
                            vendingMachineRedisEntity.getAddress(),
                            vendingMachineRedisEntity.getRemainSpaceCount(),
                            vendingMachineRedisEntity.getAvailableCount(),
                            location.getPoint().getX(),
                            location.getPoint().getY(),
                            distanceVal.getValue()
                    );
                }).toList();
    }

    public List<VendingMachineResponse> findNearByAndBookmarkVendingMachine(
            User user,
            Double longitude,
            Double latitude,
            Integer distance
    ) {
        List<VendingMachineResponse> nearbyVendingMachines = findNearByVendingMachine(longitude, latitude, distance);
        List<Long> bookmarkedBakeryIds = bookmarkRepository.findBakeryIdsByUserId(user.getId());

        if (bookmarkedBakeryIds.isEmpty()) {
            return List.of();
        }

        List<Long> spaceIdsWithBookmarkedBakery = orderRepository.findSpaceIdsByBakeryIds(bookmarkedBakeryIds);

        if (spaceIdsWithBookmarkedBakery.isEmpty()) {
            return List.of();
        }

        List<Long> vendingMachineIdsWithBookmarkedBread =
                spaceRepository.findVendingMachineIdsBySpaceIds(spaceIdsWithBookmarkedBakery);
        Set<Long> targetVendingMachineIds = new HashSet<>(vendingMachineIdsWithBookmarkedBread);

        return nearbyVendingMachines.stream()
                .filter(vm -> targetVendingMachineIds.contains(Long.parseLong(vm.id())))
                .collect(Collectors.toList());
    }

    public void warmUp() {
        var vendingMachines = vendingMachineRepository.findAll();
        List<Long> vendingMachineIds = convertToVendingMachineIds(vendingMachines);
        var spaceCounts = spaceRepository.findSpaceCountsByVendingMachineIds(vendingMachineIds);
        var availableCounts = orderRepository.findAvailableCountsByVendingMachineIds(vendingMachineIds);

        var vendingMachineIdToRemainSpaceCount = mapVendingMachineIdToRemainSpaceCount(spaceCounts);
        var vendingMachineIdToAvailableCount = mapVendingMachineIdToAvailableCount(availableCounts);

        vendingMachines.forEach(vendingMachine ->
                geoOperations.add(
                        VENDING_MACHINE_KEY,
                        new Point(vendingMachine.getLongitude(), vendingMachine.getLatitude()),
                        jsonUtil.convertToJson(VendingMachineRedisEntity.builder()
                                .id(vendingMachine.getId().toString())
                                .name(vendingMachine.getName())
                                .address(vendingMachine.getAddress())
                                .remainSpaceCount(vendingMachineIdToRemainSpaceCount
                                        .getOrDefault(vendingMachine.getId(), 0))
                                .availableCount(vendingMachineIdToAvailableCount
                                        .getOrDefault(vendingMachine.getId(), 0))
                                .build())
                )
        );
    }

    private Map<Long, Integer> mapVendingMachineIdToAvailableCount(List<OrderCountQueryResponse> availableCounts) {
        return availableCounts.stream()
                .collect(Collectors.toMap(
                        OrderCountQueryResponse::vendingMachineId,
                        OrderCountQueryResponse::count
                ));
    }

    private Map<Long, Integer> mapVendingMachineIdToRemainSpaceCount(List<SpaceCountQueryResponse> spaceCounts) {
        return spaceCounts.stream()
                .collect(Collectors.toMap(
                        SpaceCountQueryResponse::vendingMachineId,
                        SpaceCountQueryResponse::count
                ));
    }

    private List<Long> convertToVendingMachineIds(List<VendingMachine> vendingMachines) {
        return vendingMachines.stream()
                .map(VendingMachine::getId)
                .toList();
    }
}
