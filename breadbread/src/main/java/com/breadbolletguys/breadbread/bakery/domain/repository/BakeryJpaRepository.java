package com.breadbolletguys.breadbread.bakery.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;

public interface BakeryJpaRepository extends JpaRepository<Bakery, Long> {
    Optional<Bakery> findByUserId(Long userId);
}
