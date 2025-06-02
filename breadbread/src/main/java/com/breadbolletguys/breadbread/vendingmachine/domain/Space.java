package com.breadbolletguys.breadbread.vendingmachine.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.SQLRestriction;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("deleted = false")
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "space_id")
    private Long id;

    @Column(name = "vending_machine_id", nullable = false)
    private Long vendingMachineId;

    @Column(name = "occupied", nullable = false)
    private boolean occupied;

    @Column(name = "seller_id")
    private Long sellerId;

    @Column(name = "width", nullable = false)
    private int width;

    @Column(name = "height", nullable = false)
    private int height;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;

    @Builder
    public Space(
            Long vendingMachineId,
            int width,
            int height,
            boolean deleted
    ) {
        this.vendingMachineId = vendingMachineId;
        this.width = width;
        this.height = height;
        this.occupied = false;
        this.deleted = deleted;
    }

    public void buy(Long sellerId) {
        this.sellerId = sellerId;
        this.occupied = true;
    }

    public void releaseOccupied() {
        this.sellerId = null;
        this.occupied = false;
    }
}
