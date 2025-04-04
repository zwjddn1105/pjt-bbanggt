package com.breadbolletguys.breadbread.chat.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatSummary;

public interface ChatQueryRepository {
    List<ChatResponse> findByChatRoomId(Long chatRoomId, String pageToken, int pageSize);

    List<ChatQueryResponse> findAllLastChatIdByRoomIds(List<Long> chatRoomIds);

    List<ChatSummary> findAllChatContentByIdIn(List<Long> lastChatIds);
}
