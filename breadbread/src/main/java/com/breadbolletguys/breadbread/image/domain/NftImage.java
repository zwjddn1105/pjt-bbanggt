package com.breadbolletguys.breadbread.image.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.breadbolletguys.breadbread.common.domain.BaseTimeEntity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "nftImages")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NftImage extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nftImage_id")
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "image", length = 1024, nullable = false)
    private String image;

    @Builder
    public NftImage(
        Long orderId,
        String image
    ) {
        this.orderId = orderId;
        this.image = image;
    }
}
