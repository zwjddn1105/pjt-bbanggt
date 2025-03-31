package com.breadbolletguys.breadbread.ssafybank.login;

import com.breadbolletguys.breadbread.ssafybank.login.request.UserCreateRequest;
import com.breadbolletguys.breadbread.ssafybank.login.response.CreateUserSsafyApiResponse;
import com.breadbolletguys.breadbread.ssafybank.login.response.FindSsafyUserResponse;
import com.breadbolletguys.breadbread.ssafybank.login.service.SsafyLoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/ssafy/login")
@RequiredArgsConstructor
public class SsafyLoginController {
    private final SsafyLoginService ssafyLoginService;

    @PostMapping
    public ResponseEntity<CreateUserSsafyApiResponse> createSsafyUser(
        @RequestBody UserCreateRequest request
    ) {
        CreateUserSsafyApiResponse ssafyUser = ssafyLoginService.createSsafyUser(request);
        return ResponseEntity.status(CREATED).body(ssafyUser);
    }

    @GetMapping
    public ResponseEntity<FindSsafyUserResponse> findSsafyUser(
        @RequestBody UserCreateRequest request
    ) {
        FindSsafyUserResponse ssafyUser = ssafyLoginService.findSsafyUser(request);
        return ResponseEntity.ok(ssafyUser);
    }
}
