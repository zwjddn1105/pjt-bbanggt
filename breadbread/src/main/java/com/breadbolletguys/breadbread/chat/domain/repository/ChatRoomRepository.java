package com.breadbolletguys.breadbread.chat.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.chat.domain.ChatRoom;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;

import lombok.RequiredArgsConstructor;

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
        return chatRoomJpaRepository.findAllByBuyerId(userId, pageToken, DEFAULT_PAGE_SIZE);
    }

    public Page<ChatRoomQueryResponse> findAllBySellerId(Long userId, Pageable pageable) {
        return chatRoomJpaRepository.findAllBySellerId(userId, pageable);
    }

    public Optional<ChatRoom> findChatRoomByOwnerIdAndCustomerId(Long ownerId, Long customerId) {
        return chatRoomJpaRepository.findCHatRoomByOwnerIdAndCustomerId(ownerId, customerId);
    }
}
