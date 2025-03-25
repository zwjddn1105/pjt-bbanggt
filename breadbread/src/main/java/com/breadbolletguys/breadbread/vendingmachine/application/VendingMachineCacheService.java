package com.breadbolletguys.breadbread.vendingmachine.application;

import java.util.List;

import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.stereotype.Service;

import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.repository.VendingMachineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendingMachineCacheService {

    private static final String VENDING_MACHINE_KEY = "vending-machine";

    private final GeoOperations<String, String> geoOperations;
    private final VendingMachineRepository vendingMachineRepository;

    public void save(
            Double latitude,
            Double longitude,
            Long vendingMachineId
    ) {
        Point point = new Point(longitude, latitude);
        geoOperations.add(VENDING_MACHINE_KEY, point, String.valueOf(vendingMachineId));
    }

    public void delete(Long vendingMachineId) {
        geoOperations.remove(VENDING_MACHINE_KEY, String.valueOf(vendingMachineId));
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
                    return new VendingMachineResponse(
                            Long.valueOf(location.getName()),
                            location.getPoint().getX(),
                            location.getPoint().getY(),
                            distanceVal.getValue()
                    );
                }).toList();
    }

    public void warmUp() {
        var vendingMachineGeoInfo = vendingMachineRepository.findAllGeoInfo();
        vendingMachineGeoInfo.forEach(geoInfo ->
                geoOperations.add(
                        VENDING_MACHINE_KEY,
                        new Point(geoInfo.longitude(), geoInfo.latitude()),
                        String.valueOf(geoInfo.id())
                )
        );
    }
}
