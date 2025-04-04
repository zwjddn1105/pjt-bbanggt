package com.breadbolletguys.breadbread.chat.application;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.ALREADY_EXIST_CHAT_ROOM_BETWEEN_OWNER_AND_CUSTOMER;
import static com.breadbolletguys.breadbread.common.exception.ErrorCode.BAKERY_NOT_FOUND;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.chat.domain.ChatRoom;
import com.breadbolletguys.breadbread.chat.domain.dto.request.ChatRoomCreateRequest;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomBuyerOnlyResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomQueryResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomSellerOnlyResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatSummary;
import com.breadbolletguys.breadbread.chat.domain.repository.ChatRepository;
import com.breadbolletguys.breadbread.chat.domain.repository.ChatRoomRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

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

    public Page<ChatRoomSellerOnlyResponse> findAllSellerOnly(User user, Pageable pageable) {
        var chatRooms = chatRoomRepository.findAllBySellerId(user.getId(), pageable);
        List<Long> chatRoomIds = extractChatRoomIds(chatRooms.getContent());
        var chatQueryResponse = chatRepository.findAllLastChatIdByRoomIds(chatRoomIds);
        List<Long> lastChatIds = extractLastChatIds(chatQueryResponse);
        var chatSummaries = chatRepository.findAllChatContentByIdIn(lastChatIds);

        var chatIdToChatContent = mapChatIdToChatContent(chatSummaries);
        var chatRoomIdToLastChatId = mapChatRoomIdToLastChatId(chatQueryResponse);

        var chatRoomResponses = chatRooms.getContent().stream()
                .map(chatRoom -> {
                    return new ChatRoomSellerOnlyResponse(
                            chatRoom.chatRoomId(),
                            chatRoom.customerName(),
                            chatRoom.createdAt(),
                            chatIdToChatContent.getOrDefault(
                                    chatRoomIdToLastChatId.getOrDefault(chatRoom.chatRoomId(), 0L),
                                    ""
                            ),
                            chatRoom.ownerId().equals(user.getId())
                    );
                }).toList();

        return new PageImpl<>(chatRoomResponses, pageable, chatRooms.getTotalElements());
    }

    private Map<Long, Long> mapChatRoomIdToLastChatId(List<ChatQueryResponse> chatQueryResponse) {
        return chatQueryResponse.stream()
                .collect(Collectors.toMap(
                        ChatQueryResponse::roomId,
                        ChatQueryResponse::chatId
                ));
    }

    private Map<Long, String> mapChatIdToChatContent(List<ChatSummary> summaries) {
        return summaries.stream()
                .collect(Collectors.toMap(
                        ChatSummary::id,
                        ChatSummary::content
                ));
    }

    public PageInfo<ChatRoomBuyerOnlyResponse> findAllBuyerOnly(User user, String pageToken) {
        var chatRooms = chatRoomRepository.findAllByUserId(user.getId(), pageToken);
        List<Long> chatRoomIds = extractChatRoomIds(chatRooms);
        var chatQueryResponse = chatRepository.findAllLastChatIdByRoomIds(chatRoomIds);
        List<Long> lastChatIds = extractLastChatIds(chatQueryResponse);
        var chatSummaries = chatRepository.findAllChatContentByIdIn(lastChatIds);

        var chatIdToChatContent = mapChatIdToChatContent(chatSummaries);
        var chatRoomIdToLastChatId = mapChatRoomIdToLastChatId(chatQueryResponse);

        var chatRoomResponses = chatRooms.stream()
                .map(chatRoom -> {
                    return new ChatRoomBuyerOnlyResponse(
                            chatRoom.chatRoomId(),
                            chatRoom.name(),
                            chatIdToChatContent.getOrDefault(
                                    chatRoomIdToLastChatId.getOrDefault(chatRoom.chatRoomId(), 0L),
                                    ""
                            ),
                            chatRoom.createdAt()
                    );
                }).toList();

        return PageInfo.of(chatRoomResponses, DEFAULT_PAGE_SIZE, ChatRoomBuyerOnlyResponse::chatRoomId);
    }

    private List<Long> extractChatRoomIds(List<ChatRoomQueryResponse> chatRooms) {
        return chatRooms.stream()
                .map(ChatRoomQueryResponse::chatRoomId)
                .toList();
    }

    private List<Long> extractLastChatIds(List<ChatQueryResponse> chatQueryResponse) {
        return chatQueryResponse.stream()
                .map(ChatQueryResponse::chatId)
                .toList();
    }
}
