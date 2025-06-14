package com.breadbolletguys.breadbread.order.domain;

import java.time.LocalDateTime;
import java.util.Objects;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.breadbolletguys.breadbread.common.domain.BaseTimeEntity;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    private Long buyerId;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "discount", nullable = false)
    private double discount;

    @Column(name = "count", nullable = false)
    private int count;

    @Column(name = "image", length = 1024)
    private String image;

    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_state", nullable = false)
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
            int price,
            double discount,
            int count,
            String image,
            LocalDateTime expirationDate,
            ProductState productState,
            BreadType breadType
    ) {
        this.bakeryId = bakeryId;
        this.sellerId = sellerId;
        this.spaceId = spaceId;
        this.buyerId = buyerId;
        this.price = price;
        this.discount = discount;
        this.count = count;
        this.image = image;
        this.expirationDate = expirationDate;
        this.productState = productState;
        this.breadType = breadType;
    }

    public void completePurchase(Long buyerId) {
        this.buyerId = buyerId;
        this.productState = ProductState.SOLD_OUT;
    }

    public void cancelPurchase() {
        this.buyerId = null;
        this.productState = ProductState.AVAILABLE;
    }

    public void completePickUp() {
        this.productState = ProductState.FINISHED;
    }

    public boolean isBuyer(User user) {
        return Objects.equals(user.getId(), this.buyerId);
    }

    public boolean isFinish() {
        return productState.equals(ProductState.FINISHED);
    }
}
