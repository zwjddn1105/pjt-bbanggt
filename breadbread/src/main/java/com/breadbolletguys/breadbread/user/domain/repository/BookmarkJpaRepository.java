package com.breadbolletguys.breadbread.user.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.user.domain.Bookmark;

public interface BookmarkJpaRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByUserIdAndBakeryId(Long userId, Long bakeryId);

    void deleteByUserIdAndBakeryId(Long userId, Long bakeryId);
}
