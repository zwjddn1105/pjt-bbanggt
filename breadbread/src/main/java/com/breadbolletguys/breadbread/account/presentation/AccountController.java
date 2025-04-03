package com.breadbolletguys.breadbread.account.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.account.application.AccountService;
import com.breadbolletguys.breadbread.account.domain.dto.response.AccountResponse;
import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/v1/account")
@RestController
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<Void> createAccount(@AuthUser User user) {
        accountService.createAccount(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAccounts(@AuthUser User user) {
        return ResponseEntity.ok(accountService.getAccountList(user));
    }
}
