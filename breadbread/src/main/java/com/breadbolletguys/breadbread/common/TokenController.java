package com.breadbolletguys.breadbread.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.JwtUtil;
import com.breadbolletguys.breadbread.auth.domain.UserTokens;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TokenController {

    private static final String USER_ID = "1";

    private final JwtUtil jwtUtil;

    @GetMapping("/api/v1/access-tokens")
    public ResponseEntity<UserTokens> getAccessToken() {
        return ResponseEntity.ok(jwtUtil.createLoginToken(USER_ID));
    }
}
