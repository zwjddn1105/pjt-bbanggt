package com.breadbolletguys.breadbread.chat.domain.repository;

import com.breadbolletguys.breadbread.chat.domain.ChatRoom;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ChatRoomRepository {

    private static final int DEFAULT_PAGE_SIZE = 20;

    private final ChatRoomJpaRepository chatRoomJpaRepository;

    public Optional<ChatRoom> findById(Long id) {
        return chatRoomJpaRepository.findById(id);
    }

    public ChatRoom save(ChatRoom chatRoom) {
        return chatRoomJpaRepository.save(chatRoom);
    }

    public boolean existsByOwnerIdAndCustomerId(Long ownerId, Long customerId) {
        return chatRoomJpaRepository.existsByOwnerIdAndCustomerId(ownerId, customerId);
    }

    public List<ChatRoomQueryResponse> findAllByUserId(Long userId, String pageToken) {
        return chatRoomJpaRepository.findAllByUserId(userId, pageToken, DEFAULT_PAGE_SIZE);
    }
}
