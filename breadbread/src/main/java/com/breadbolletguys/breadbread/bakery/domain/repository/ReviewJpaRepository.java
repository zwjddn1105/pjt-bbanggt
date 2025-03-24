package com.breadbolletguys.breadbread.bakery.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.bakery.domain.Review;

public interface ReviewJpaRepository extends JpaRepository<Review, Long> {
}
