package com.breadbolletguys.breadbread.chat.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.chat.domain.Chat;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatResponse;
import com.breadbolletguys.breadbread.common.model.PageInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChatRepository {

    private static final int DEFAULT_PAGE_SIZE = 20;

    private final ChatJpaRepository chatJpaRepository;

    public Chat save(Chat chat) {
        return chatJpaRepository.save(chat);
    }

    public PageInfo<ChatResponse> findAllByChatRoomId(Long chatRoomId, String pageToken) {
        var data = chatJpaRepository.findByChatRoomId(chatRoomId, pageToken, DEFAULT_PAGE_SIZE);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, ChatResponse::id);
    }

    public List<ChatQueryResponse> findAllLastChatByRoomIds(List<Long> chatRoomIds) {
        return chatJpaRepository.findAllLastChatByRoomIds(chatRoomIds);
    }
}
