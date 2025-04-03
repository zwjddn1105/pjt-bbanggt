package com.breadbolletguys.breadbread.chat.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.chat.domain.ChatRoom;

public interface ChatRoomJpaRepository extends JpaRepository<ChatRoom, Long>, ChatRoomQueryRepository {
}
