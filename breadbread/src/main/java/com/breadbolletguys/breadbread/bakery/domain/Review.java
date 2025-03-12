package com.breadbolletguys.breadbread.bakery.domain;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import org.hibernate.annotations.Type;

import com.breadbolletguys.breadbread.common.domain.BaseTimeEntity;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@Table(
    name = "review_id",
    indexes = {
        @Index(name = "idx_bakery_id_desc", columnList = "bakery_id, review_id desc")
    }
)
public class Review extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = IDENTITY)
    @Column(name = "review_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "bakery_id", nullable = false)
    private Long bakeryId;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Embedded
    @Column(name = "score", nullable = false)
    private Score score;

    @Type(JsonType.class)
    @Column(columnDefinition = "JSON")
    private List<String> imageUrls;

    @Builder
    private Review(
        Long userId,
        Long bakeryId,
        String content,
        Score score,
        List<String> imageUrls
    ) {
        this.userId = userId;
        this.bakeryId = bakeryId;
        this.content = content;
        this.score = score;
        this.imageUrls = imageUrls;
    }
}
