package com.breadbolletguys.breadbread.chat.application;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.chat.domain.ChatRoom;
import com.breadbolletguys.breadbread.chat.domain.dto.request.ChatRoomCreateRequest;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomBuyerOnlyResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomSellerOnlyResponse;
import com.breadbolletguys.breadbread.chat.domain.repository.ChatRepository;
import com.breadbolletguys.breadbread.chat.domain.repository.ChatRoomRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.ALREADY_EXIST_CHAT_ROOM_BETWEEN_OWNER_AND_CUSTOMER;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.BAKERY_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private static final int DEFAULT_PAGE_SIZE = 20;

    private final ChatRoomRepository chatRoomRepository;
    private final BakeryRepository bakeryRepository;
    private final ChatRepository chatRepository;

    public Long save(User user, ChatRoomCreateRequest chatRoomCreateRequest) {
        Bakery bakery = bakeryRepository.findById(chatRoomCreateRequest.bakeryId())
                .orElseThrow(() -> new BadRequestException(BAKERY_NOT_FOUND));

        if (chatRoomRepository.existsByOwnerIdAndCustomerId(user.getId(), bakery.getUserId())) {
            throw new BadRequestException(ALREADY_EXIST_CHAT_ROOM_BETWEEN_OWNER_AND_CUSTOMER);
        }

        ChatRoom chatRoom = ChatRoom.builder()
                .name(bakery.getName())
                .ownerId(bakery.getUserId())
                .customerId(user.getId())
                .build();

        return chatRoomRepository.save(chatRoom).getId();
    }

    public PageInfo<ChatRoomSellerOnlyResponse> findAllSellerOnly(User user, String pageToken) {
        var chatRooms = chatRoomRepository.findAllByUserId(user.getId(), pageToken);
        List<Long> chatRoomIds = extractChatRoomIds(chatRooms);
        Map<Long, String> roomIdToLastContent = mapRoomIdToLastContent(chatRoomIds);

        var chatRoomResponses = chatRooms.stream()
                .map(chatRoom -> {
                    return new ChatRoomSellerOnlyResponse(
                            chatRoom.chatRoomId(),
                            chatRoom.customerName(),
                            chatRoom.createdAt(),
                            roomIdToLastContent.getOrDefault(chatRoom.chatRoomId(), ""),
                            chatRoom.ownerId().equals(user.getId())
                    );
                }).toList();

        return PageInfo.of(chatRoomResponses, DEFAULT_PAGE_SIZE, ChatRoomSellerOnlyResponse::chatRoomId);
    }

    public PageInfo<ChatRoomBuyerOnlyResponse> findAllBuyerOnly(User user, String pageToken) {
        var chatRooms = chatRoomRepository.findAllByUserId(user.getId(), pageToken);
        List<Long> chatRoomIds = extractChatRoomIds(chatRooms);
        Map<Long, String> roomIdToLastContent = mapRoomIdToLastContent(chatRoomIds);

        var chatRoomResponses = chatRooms.stream()
                .map(chatRoom -> {
                    return new ChatRoomBuyerOnlyResponse(
                            chatRoom.chatRoomId(),
                            chatRoom.name(),
                            roomIdToLastContent.getOrDefault(chatRoom.chatRoomId(), ""),
                            chatRoom.createdAt()
                    );
                }).toList();

        return PageInfo.of(chatRoomResponses, DEFAULT_PAGE_SIZE, ChatRoomBuyerOnlyResponse::chatRoomId);
    }

    private Map<Long, String> mapRoomIdToLastContent(List<Long> chatRoomIds) {
        return chatRepository.findAllLastChatByRoomIds(chatRoomIds).stream()
                .collect(Collectors.toMap(
                        ChatQueryResponse::roomId,
                        ChatQueryResponse::content
                ));
    }

    private List<Long> extractChatRoomIds(List<ChatRoomQueryResponse> chatRooms) {
        return chatRooms.stream()
                .map(ChatRoomQueryResponse::chatRoomId)
                .toList();
    }
}
