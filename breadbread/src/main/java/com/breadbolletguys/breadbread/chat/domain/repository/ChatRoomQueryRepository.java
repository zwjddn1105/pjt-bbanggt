package com.breadbolletguys.breadbread.chat.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;

public interface ChatRoomQueryRepository {
    List<ChatRoomQueryResponse> findAllByUserId(Long userId, String pageToken, int pageSize);
}
