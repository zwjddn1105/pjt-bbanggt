package com.breadbolletguys.breadbread.chat.domain.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;

public interface ChatRoomQueryRepository {
    List<ChatRoomQueryResponse> findAllByBuyerId(Long userId, String pageToken, int pageSize);

    Page<ChatRoomQueryResponse> findAllBySellerId(Long userId, Pageable pageable);

    boolean existsByOwnerIdAndCustomerId(Long ownerId, Long customerId);
}
