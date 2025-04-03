package com.breadbolletguys.breadbread.user.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.breadbolletguys.breadbread.user.domain.Bookmark;

public interface BookmarkJpaRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByUserIdAndBakeryId(Long userId, Long bakeryId);

    void deleteByUserIdAndBakeryId(Long userId, Long bakeryId);

    @Query("SELECT b.bakeryId FROM Bookmark b WHERE b.userId = :userId")
    List<Long> findBakeryIdsByUserId(@Param("userId") Long userId);
}
