package com.breadbolletguys.breadbread.user.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepository {
    private final UserJpaRepository userJpaRepository;

    public User save(User user) {
        return userJpaRepository.save(user);
    }

    public Optional<User> findBySocialId(String socialId) {
        return userJpaRepository.findBySocialId(socialId);
    }

    public Optional<User> findById(Long id) {
        return userJpaRepository.findById(id);
    }
}