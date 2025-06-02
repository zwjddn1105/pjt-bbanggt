package com.breadbolletguys.breadbread.chat.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.breadbolletguys.breadbread.chat.domain.ChatRoom;

public interface ChatRoomJpaRepository extends JpaRepository<ChatRoom, Long>, ChatRoomQueryRepository {
    @Query("""
        SELECT cr
        FROM ChatRoom cr
        WHERE (cr.customerId = :customerId AND cr.ownerId = :ownerId)
        OR (cr.customerId = :ownerId AND cr.ownerId = :customerId)
        """)
    Optional<ChatRoom> findCHatRoomByOwnerIdAndCustomerId(Long ownerId, Long customerId);
}
