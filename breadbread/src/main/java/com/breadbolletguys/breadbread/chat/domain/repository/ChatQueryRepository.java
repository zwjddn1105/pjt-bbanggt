package com.breadbolletguys.breadbread.chat.domain.repository;

import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatResponse;

import java.util.List;

public interface ChatQueryRepository {
    List<ChatResponse> findByChatRoomId(Long chatRoomId, String pageToken, int pageSize);

    List<ChatQueryResponse> findAllLastChatByRoomIds(List<Long> chatRoomIds);
}
