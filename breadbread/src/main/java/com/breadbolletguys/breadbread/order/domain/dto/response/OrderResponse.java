package com.breadbolletguys.breadbread.order.domain.dto.response;

import java.time.LocalDateTime;

import com.breadbolletguys.breadbread.order.domain.BreadType;
import com.breadbolletguys.breadbread.order.domain.ProductState;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long orderId;
    private String address;
    private String bakeryName;
    private int price;
    private int salePrice;
    private int count;
    private String image;
    private ProductState productState;
    private BreadType breadType;
    private Long bakeryId;
    private Long vendingMachineId;
    private Double latitude;
    private Double longitude;
    private String vendingMachineName;
    private int slotNumber;
    private LocalDateTime paymentDate;

    public OrderResponse(Long orderId, String address, String bakeryName, int price, int salePrice,
                         int count, String image, ProductState productState, BreadType breadType,
                         Long bakeryId, Long vendingMachineId, Double latitude, Double longitude,
                         String vendingMachineName, int slotNumber) {
        this.orderId = orderId;
        this.address = address;
        this.bakeryName = bakeryName;
        this.price = price;
        this.salePrice = salePrice;
        this.count = count;
        this.image = image;
        this.productState = productState;
        this.breadType = breadType;
        this.bakeryId = bakeryId;
        this.vendingMachineId = vendingMachineId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.vendingMachineName = vendingMachineName;
        this.slotNumber = slotNumber;
    }

}