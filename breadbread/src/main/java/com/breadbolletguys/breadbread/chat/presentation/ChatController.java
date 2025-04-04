package com.breadbolletguys.breadbread.chat.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.chat.application.ChatService;
import com.breadbolletguys.breadbread.chat.domain.dto.request.ChatRequest;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatResponse;
import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chats")
public class ChatController {

    private final ChatService chatService;

    /**
     * 채팅을 DB에 저장한다.
     */
    @PostMapping
    public ResponseEntity<Void> create(
            @AuthUser User user,
            @RequestBody ChatRequest chatRequest
    ) {
        Long chatId = chatService.save(user, chatRequest);
        return ResponseEntity.created(URI.create("/api/v1/chats/" + chatId)).build();
    }

    /**
     * 채팅방에 속한 채팅을 불러온다.
     * @Param pageToken : 이전에 조회한 마지막 채팅의 ID, 최초 요청시 null, 이후로는 응답에서 파싱해서 전달
     */
    @GetMapping
    public ResponseEntity<PageInfo<ChatResponse>> findAll(
            @AuthUser User user,
            @RequestParam(name = "chatRoomId") Long chatRoomId,
            @RequestParam(required = false, name = "pageToken") String pageToken
    ) {
        return ResponseEntity.ok(chatService.findAll(user, chatRoomId, pageToken));
    }
}
