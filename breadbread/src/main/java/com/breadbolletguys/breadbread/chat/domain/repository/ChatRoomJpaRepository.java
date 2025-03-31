package com.breadbolletguys.breadbread.chat.domain.repository;

import com.breadbolletguys.breadbread.chat.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomJpaRepository extends JpaRepository<ChatRoom, Long>, ChatRoomQueryRepository {

    boolean existsByOwnerIdAndCustomerId(Long ownerId, Long customerId);
}
