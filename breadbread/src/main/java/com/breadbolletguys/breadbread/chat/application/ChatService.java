package com.breadbolletguys.breadbread.chat.application;

import static com.breadbolletguys.breadbread.common.exception.ErrorCode.*;

import org.springframework.stereotype.Service;

import com.breadbolletguys.breadbread.chat.domain.Chat;
import com.breadbolletguys.breadbread.chat.domain.ChatRoom;
import com.breadbolletguys.breadbread.chat.domain.dto.request.ChatRequest;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatResponse;
import com.breadbolletguys.breadbread.chat.domain.repository.ChatRepository;
import com.breadbolletguys.breadbread.chat.domain.repository.ChatRoomRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;

    public Long save(User user, ChatRequest chatRequest) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRequest.chatRoomId())
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CHAT_ROOM));

        if (!chatRoom.isJoinedUser(user)) {
            throw new BadRequestException(USER_NOT_IN_CHAT_ROOM);
        }

        Chat chat = Chat.builder()
                .chatRoomId(chatRequest.chatRoomId())
                .content(chatRequest.content())
                .senderId(user.getId())
                .build();

        return chatRepository.save(chat).getId();
    }

    public PageInfo<ChatResponse> findAll(User user, Long chatRoomId, String pageToken) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new BadRequestException(NOT_FOUND_CHAT_ROOM));

        if (!chatRoom.isJoinedUser(user)) {
            throw new BadRequestException(USER_NOT_IN_CHAT_ROOM);
        }

        return chatRepository.findAllByChatRoomId(chatRoomId, pageToken);
    }
}
