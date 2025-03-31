package com.breadbolletguys.breadbread.chat.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.chat.domain.Chat;

public interface ChatJpaRepository extends JpaRepository<Chat, Long>, ChatQueryRepository {
}
