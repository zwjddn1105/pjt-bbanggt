package com.breadbolletguys.breadbread.refund.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.breadbolletguys.breadbread.common.domain.BaseTimeEntity;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Refund extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id")
    private Long id;

    @Column(name =  "order_id", nullable = false)
    private Long orderId;

    @Column(name = "customerId", nullable = false)
    private Long customerId;

    @Column(name = "sellerId", nullable = false)
    private Long sellerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private RefundState state;

    @Builder
    public Refund(
            Long id,
            Long orderId,
            Long customerId,
            Long sellerId
    ) {
        this.id = id;
        this.orderId = orderId;
        this.customerId = customerId;
        this.sellerId = sellerId;
        this.state = RefundState.PROCESSING;
    }

    public boolean isSeller(User user) {
        return sellerId.equals(user.getId());
    }

    public void confirm() {
        this.state = RefundState.COMPLETED;
    }

    public boolean canConfirm() {
        return state == RefundState.PROCESSING;
    }
}
