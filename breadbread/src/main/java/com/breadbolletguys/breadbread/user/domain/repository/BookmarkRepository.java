package com.breadbolletguys.breadbread.user.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.user.domain.Bookmark;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BookmarkRepository {
    private final BookmarkJpaRepository bookmarkJpaRepository;

    public void save(Bookmark bookmark) {
        bookmarkJpaRepository.save(bookmark);
    }

    public void deleteByUserIdAndBakeryId(Long userId, Long bakeryId) {
        bookmarkJpaRepository.deleteByUserIdAndBakeryId(userId, bakeryId);
    }

    public List<Long> findBakeryIdsByUserId(Long userId) {
        return bookmarkJpaRepository.findBakeryIdsByUserId(userId);
    }

    public boolean existsByUserIdAndBakeryId(Long userId, Long bakeryId) {
        return bookmarkJpaRepository.existsByUserIdAndBakeryId(userId, bakeryId);
    }
}
