package com.breadbolletguys.breadbread.order.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.breadbolletguys.breadbread.common.domain.BaseTimeEntity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Table(name = "orders")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @Column(name = "bakery_id", nullable = false)
    private Long bakeryId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "space_id", nullable = false)
    private Long spaceId;

    @Column(name = "buyer_id")
    @Setter
    private Long buyerId;

    @Column(name = "name", length = 128, nullable = false)
    private String name;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "count", nullable = false)
    private int count;

    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_state", nullable = false)
    @Setter
    private ProductState productState;

    @Enumerated(EnumType.STRING)
    @Column(name = "bread_type", nullable = false)
    private BreadType breadType;

    @Builder
    private Order(
            Long bakeryId,
            Long sellerId,
            Long spaceId,
            Long buyerId,
            String name,
            int price,
            int count,
            LocalDateTime expirationDate,
            ProductState productState,
            BreadType breadType
    ) {
        this.bakeryId = bakeryId;
        this.sellerId = sellerId;
        this.spaceId = spaceId;
        this.buyerId = buyerId;
        this.name = name;
        this.price = price;
        this.count = count;
        this.expirationDate = expirationDate;
        this.productState = productState;
        this.breadType = breadType;
    }
}
