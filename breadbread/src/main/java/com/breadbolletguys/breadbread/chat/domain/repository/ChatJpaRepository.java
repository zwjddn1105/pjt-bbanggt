package com.breadbolletguys.breadbread.chat.domain.repository;

import com.breadbolletguys.breadbread.chat.domain.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatJpaRepository extends JpaRepository<Chat, Long>, ChatQueryRepository {
}
