package com.breadbolletguys.breadbread.user.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.user.domain.User;

public interface UserJpaRepository extends JpaRepository<User, Long> {
    Optional<User> findBySocialId(String socialId);
}
