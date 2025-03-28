package com.breadbolletguys.breadbread.chat.domain.repository;

import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;

import java.util.List;

public interface ChatRoomQueryRepository {
    List<ChatRoomQueryResponse> findAllByUserId(Long userId, String pageToken, int pageSize);
}
