package com.breadbolletguys.breadbread.ssafybank.account;

import com.breadbolletguys.breadbread.ssafybank.account.dto.CreateAccountRequestDto;
import com.breadbolletguys.breadbread.ssafybank.account.response.CreateAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.service.SsafyAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/ssafy/account")
@RestController
@RequiredArgsConstructor
public class Controller {
    private final SsafyAccountService accountService;

    @PostMapping
    public ResponseEntity<CreateAccountResponse> createAccount(
        @RequestBody CreateAccountRequestDto request
    ) {
        CreateAccountResponse account = accountService.createAccount(request);
        return ResponseEntity.ok(account);
    }

    @GetMapping
    public ResponseEntity<FindAccountResponse> findAccount(
    ) {
        FindAccountResponse account = accountService.findAccount();
        return ResponseEntity.ok(account);
    }

}

//16a1e465-26c5-45d5-a728-433baff7f585