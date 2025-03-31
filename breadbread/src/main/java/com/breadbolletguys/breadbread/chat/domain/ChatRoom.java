package com.breadbolletguys.breadbread.chat.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class ChatRoom extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 32)
    private String name;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Builder
    public ChatRoom(
            Long id,
            String name,
            Long customerId,
            Long ownerId
    ) {
        this.id = id;
        this.name = name;
        this.customerId = customerId;
        this.ownerId = ownerId;
    }

    public boolean isJoinedUser(User user) {
        return customerId.equals(user.getId()) || ownerId.equals(user.getId());
    }
}