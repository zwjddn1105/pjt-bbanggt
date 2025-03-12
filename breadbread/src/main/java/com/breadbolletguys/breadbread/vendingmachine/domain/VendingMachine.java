package com.breadbolletguys.breadbread.vendingmachine.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VendingMachine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vending_machine_id")
    private Long id;

    @Column(name = "point", nullable = false, columnDefinition = "POINT")
    private String point;

    @Column(name = "image_urls", columnDefinition = "JSON")
    private List<String> imageUrls;

    @Column(name = "memo", length = 256, nullable = false)
    private String memo;

    @Column(name = "available_count", nullable = false)
    private int availableCount;

    @Column(name = "total_count", nullable = false)
    private int totalCount;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;
}
