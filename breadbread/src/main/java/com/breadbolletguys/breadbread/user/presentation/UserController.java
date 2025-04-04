package com.breadbolletguys.breadbread.user.presentation;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.account.domain.dto.request.AccountRequest;
import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.order.application.OrderService;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.dto.response.UserResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final OrderService orderService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> findById(@AuthUser User user) {
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PostMapping("/purchaseTickets")
    @Operation(description = "사용자가 티켓을 구매합니다.(티켓 구매가 100원)")
    public ResponseEntity<Void> purchaseTickets(
            @AuthUser User user,
            @RequestBody AccountRequest accountRequest
    ) {
        orderService.payForTicket(user, accountRequest.getAccountNo());
        return ResponseEntity.ok().build();
    }
}
