package com.breadbolletguys.breadbread.bakery.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;

public interface BakeryJpaRepository extends JpaRepository<Bakery, Long> {
}
