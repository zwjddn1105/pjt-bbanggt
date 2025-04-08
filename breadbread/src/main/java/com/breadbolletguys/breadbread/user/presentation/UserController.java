package com.breadbolletguys.breadbread.user.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.user.application.UserService;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.dto.request.TicketPurchaseRequest;
import com.breadbolletguys.breadbread.user.domain.dto.response.UserResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> findById(@AuthUser User user) {
        return ResponseEntity.ok(userService.getMyInfo(user));
    }

    @PostMapping("/purchaseTickets")
    @Operation(description = "사용자가 티켓을 구매합니다.(티켓 구매가 100원)")
    public ResponseEntity<Void> purchaseTickets(
            @AuthUser User user,
            @RequestBody TicketPurchaseRequest ticketPurchaseRequest
    ) {
        userService.payForTicket(user, ticketPurchaseRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/notice-toggle")
    public ResponseEntity<Void> toggleNotice(
            @AuthUser User user
    ) {
        userService.toggle(user.getId());
        return ResponseEntity.noContent().build();
    }
}
