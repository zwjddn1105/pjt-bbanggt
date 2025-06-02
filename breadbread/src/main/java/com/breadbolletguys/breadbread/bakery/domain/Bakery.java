package com.breadbolletguys.breadbread.bakery.domain;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.breadbolletguys.breadbread.common.domain.BaseTimeEntity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@Table(
    name = "bakery"
)
public class Bakery extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = IDENTITY)
    @Column(name = "bakery_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", length = 32, nullable = false)
    private String name;

    @Column(name = "business_number", length = 32, nullable = false)
    private String businessNumber;

    @Column(name = "address", length = 128, nullable = false)
    private String address;

    @Column(name = "authentication_date", nullable = false)
    private LocalDateTime authenticationDate;

    @Column(name = "authenticated", nullable = false)
    private Boolean authenticated;


    @Builder
    private Bakery(
        Long userId,
        String name,
        String businessNumber,
        String address,
        LocalDateTime authenticationDate,
        Boolean authenticated
    ) {
        this.userId = userId;
        this.name = name;
        this.businessNumber = businessNumber;
        this.address = address;
        this.authenticationDate = authenticationDate;
        this.authenticated = authenticated;
    }

    public void update(String name, String businessNumber, String address) {
        this.name = name;
        this.businessNumber = businessNumber;
        this.address = address;
    }
}
