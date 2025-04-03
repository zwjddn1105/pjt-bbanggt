package com.breadbolletguys.breadbread.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.breadbolletguys.breadbread.common.domain.BaseTimeEntity;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "social_id", length = 32, nullable = false)
    private String socialId;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole userRole;

    @Column(name = "email", length = 64, nullable = false)
    private String email;

    @Column(name = "name", length = 32, nullable = false)
    private String name;

    @Column(name = "notice_check", nullable = false)
    private boolean noticeCheck;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;

    @Column(name = "userKey", length = 60, nullable = false)
    private String userKey;

    @Column(name = "tickets", nullable = false)
    private int tickets;

    @Builder
    public User(
            String socialId,
            UserRole userRole,
            String name,
            boolean noticeCheck,
            boolean deleted,
            String email,
            String userKey
    ) {
        this.socialId = socialId;
        this.userRole = userRole;
        this.name = name;
        this.noticeCheck = noticeCheck;
        this.deleted = deleted;
        this.email = email;
        this.userKey = userKey;
        this.tickets = 5;
    }

    public boolean isAdmin() {
        return userRole == UserRole.ADMIN;
    }

    public boolean isSeller() {
        return userRole.equals(UserRole.SELLER);
    }

    public void changeSeller() {
        if (this.userRole == UserRole.SELLER) {
            throw new BadRequestException(ErrorCode.ALREADY_SELLER);
        }
        this.userRole = UserRole.SELLER;
    }
}
