package com.breadbolletguys.breadbread.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.JwtUtil;
import com.breadbolletguys.breadbread.auth.domain.UserTokens;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TokenController {

    private static final String USER_ID = "1";

    private final JwtUtil jwtUtil;

    @GetMapping("/api/v1/access-tokens")
    @Operation(description = "테스트용 JWT 토큰을 발급받는다, 이걸로 발급받은 accessToken, refreshToken 으로 테스트 가능")
    public ResponseEntity<UserTokens> getAccessToken() {
        return ResponseEntity.ok(jwtUtil.createLoginToken(USER_ID));
    }
}
