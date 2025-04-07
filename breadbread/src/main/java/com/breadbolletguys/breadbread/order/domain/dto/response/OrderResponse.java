package com.breadbolletguys.breadbread.order.domain.dto.response;

import java.time.LocalDateTime;

import com.breadbolletguys.breadbread.order.domain.BreadType;
import com.breadbolletguys.breadbread.order.domain.ProductState;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
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
}