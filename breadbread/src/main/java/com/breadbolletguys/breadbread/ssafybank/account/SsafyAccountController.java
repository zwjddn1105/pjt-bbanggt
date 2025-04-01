package com.breadbolletguys.breadbread.ssafybank.account;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.ssafybank.account.request.CreateAccountRequest;
import com.breadbolletguys.breadbread.ssafybank.account.response.CreateAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindUserAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.service.SsafyAccountService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/ssafy/account")
@RestController
@RequiredArgsConstructor
public class SsafyAccountController {
    private final SsafyAccountService accountService;

    @PostMapping
    public ResponseEntity<CreateAccountResponse> createAccount(
        @RequestBody CreateAccountRequest request
    ) {
        CreateAccountResponse account = accountService.createAccount(request);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/accounts")
    public ResponseEntity<FindUserAccountResponse> findUserAccount(
        @RequestBody CreateAccountRequest request
    ) {
        FindUserAccountResponse userAccounts = accountService.findUserAccount(request);
        return ResponseEntity.ok(userAccounts);
    }

    @GetMapping
    public ResponseEntity<FindAccountResponse> findAccount() {
        FindAccountResponse account = accountService.findProductAccount();
        return ResponseEntity.ok(account);
    }

}

//16a1e465-26c5-45d5-a728-433baff7f585