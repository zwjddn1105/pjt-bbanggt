package com.breadbolletguys.breadbread.vendingmachine.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Type;

import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE vending_machine SET deleted = true WHERE vending_machine_id = ?")
@SQLRestriction("deleted = false")
public class VendingMachine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vending_machine_id")
    private Long id;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Type(JsonType.class)
    @Column(name = "image_urls", columnDefinition = "JSON")
    private List<String> imageUrls;

    @Column(name = "memo", length = 256, nullable = false)
    private String memo;

    @Column(name = "name", length = 32, nullable = false)
    private String name;

    @Column(name = "available_count", nullable = false)
    private int availableCount;

    @Column(name = "total_count", nullable = false)
    private int totalCount;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;

    @Column(name = "height", nullable = false)
    private int height;

    @Column(name = "width", nullable = false)
    private int width;

    @Builder
    public VendingMachine(
            Long id,
            Double longitude,
            Double latitude,
            List<String> imageUrls,
            String memo,
            int height,
            int width,
            String name
    ) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;
        this.imageUrls = imageUrls;
        this.memo = memo;
        this.height = height;
        this.width = width;
        this.totalCount = height * width;
        this.availableCount = height * width;
        this.deleted = false;
        this.name = name;
    }
}
