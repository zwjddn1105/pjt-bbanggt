package com.breadbolletguys.breadbread.user.domain;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@Table(
    name = "bookmark",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_bakery", columnNames = {"user_id", "bakery_id"})
    },
    indexes = {
        @Index(name = "idx_bakery_user", columnList = "bakery_id, user_id desc")
    }
)
public class Bookmark {
    @Id @GeneratedValue(strategy = IDENTITY)
    @Column(name = "bookmark_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "bakery_id", nullable = false)
    private Long bakeryId;

    @Builder
    private Bookmark(
            Long userId,
            Long bakeryId
    ) {
        this.userId = userId;
        this.bakeryId = bakeryId;
    }
}
