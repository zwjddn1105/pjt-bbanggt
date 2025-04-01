package com.breadbolletguys.breadbread.vendingmachine.application;

import java.util.List;

import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.stereotype.Service;


import com.breadbolletguys.breadbread.common.util.JsonUtil;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachine;
import com.breadbolletguys.breadbread.vendingmachine.domain.VendingMachineRedisEntity;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.VendingMachineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendingMachineCacheService {

    private static final String VENDING_MACHINE_KEY = "vending-machine";

    private final GeoOperations<String, String> geoOperations;
    private final VendingMachineRepository vendingMachineRepository;
    private final JsonUtil jsonUtil;

    public void save(
            Double latitude,
            Double longitude,
            VendingMachine vendingMachine
    ) {
        Point point = new Point(longitude, latitude);
        var vendingMachineRedisEntity = VendingMachineRedisEntity.builder()
                .id(vendingMachine.getId().toString())
                .address(vendingMachine.getAddress())
                .name(vendingMachine.getName())
                .build();

        geoOperations.add(VENDING_MACHINE_KEY, point, jsonUtil.convertToJson(vendingMachineRedisEntity));
    }

    public void delete(VendingMachineRedisEntity vendingMachineRedisEntity) {
        geoOperations.remove(VENDING_MACHINE_KEY, jsonUtil.convertToJson(vendingMachineRedisEntity));
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
                            location.getPoint().getX(),
                            location.getPoint().getY(),
                            distanceVal.getValue()
                    );
                }).toList();
    }

    public void warmUp() {
        var vendingMachines = vendingMachineRepository.findAll();

        vendingMachines.forEach(vendingMachine ->
                geoOperations.add(
                        VENDING_MACHINE_KEY,
                        new Point(vendingMachine.getLongitude(), vendingMachine.getLatitude()),
                        jsonUtil.convertToJson(VendingMachineRedisEntity.builder()
                                .id(vendingMachine.getId().toString())
                                .name(vendingMachine.getName())
                                .address(vendingMachine.getAddress())
                                .build())
                )
        );
    }
}
