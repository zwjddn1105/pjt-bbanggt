package com.breadbolletguys.breadbread.chat.presentation;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.chat.application.ChatRoomService;
import com.breadbolletguys.breadbread.chat.domain.dto.request.ChatRoomCreateRequest;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomBuyerOnlyResponse;
import com.breadbolletguys.breadbread.chat.domain.dto.response.ChatRoomSellerOnlyResponse;
import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat-rooms")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    /**
     * 빵집 아이디를 통해 빵집 문의를 생성한다.
     */
    @PostMapping
    public ResponseEntity<Void> save(
            @AuthUser User user,
            @RequestBody ChatRoomCreateRequest chatRoomCreateRequest
    ) {
        Long chatRoomId = chatRoomService.save(user, chatRoomCreateRequest);
        return ResponseEntity.created(URI.create("/api/v1/chat-rooms" + chatRoomId)).build();
    }

    /**
     * 판매자용 문의 내용 조회
     */
    @GetMapping("/seller")
    public ResponseEntity<Page<ChatRoomSellerOnlyResponse>> findAllSellerOnly(
            @AuthUser User user,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(chatRoomService.findAllSellerOnly(user, pageable));
    }

    /**
     * 구매자용 문의 내용 조회
     */
    @GetMapping("/buyer")
    public ResponseEntity<PageInfo<ChatRoomBuyerOnlyResponse>> findAllBuyerOnly(
            @AuthUser User user,
            @RequestParam(required = false, name = "pageToken") String pageToken
    ) {
        return ResponseEntity.ok(chatRoomService.findAllBuyerOnly(user, pageToken));
    }
}
