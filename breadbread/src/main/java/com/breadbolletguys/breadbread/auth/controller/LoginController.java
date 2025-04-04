package com.breadbolletguys.breadbread.auth.controller;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.domain.request.LoginRequest;
import com.breadbolletguys.breadbread.auth.domain.response.AccessTokenResponse;
import com.breadbolletguys.breadbread.auth.domain.response.LoginResponse;
import com.breadbolletguys.breadbread.auth.service.LoginService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class LoginController {

    private static final int ONE_WEEK_SECONDS = 604800;

    private final LoginService loginService;

    @PostMapping(value = "/login/kakao")
    @Operation(description = "auth code를 받아서 로그인을 완료하고 access/refresh 토큰을 전달한다.")
    public ResponseEntity<LoginResponse> kakaoLogin(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        var loginResponse = loginService.login(loginRequest);

        ResponseCookie cookie = ResponseCookie.from("refresh-token", loginResponse.refreshToken())
                .maxAge(ONE_WEEK_SECONDS)
                .secure(true)
                .httpOnly(true)
                .sameSite("None")
                .domain("j12a209.p.ssafy.io")
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(loginResponse);
    }


    @PostMapping("/reissue")
    @Operation(description = "refresh-token을 재발급 받는다.")
    public ResponseEntity<AccessTokenResponse> reissueToken(
            @CookieValue("refresh-token") String refreshToken,
            @RequestHeader("Authorization") String authHeader
    ) {
        String reissuedToken = loginService.reissueAccessToken(refreshToken, authHeader);
        return ResponseEntity.ok(new AccessTokenResponse(reissuedToken));
    }

    @PostMapping(value = "/logout")
    @Operation(description = "refresh-token을 받아서 로그아웃을 진행한다.")
    public ResponseEntity<Void> logout(
            @CookieValue("refresh-token") String refreshToken
    ) {

        loginService.logout(refreshToken);
        return ResponseEntity.noContent().build();
    }
}
