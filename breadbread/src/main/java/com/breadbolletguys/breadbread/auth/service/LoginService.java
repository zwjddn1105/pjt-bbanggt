package com.breadbolletguys.breadbread.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.auth.JwtUtil;
import com.breadbolletguys.breadbread.auth.domain.RefreshToken;
import com.breadbolletguys.breadbread.auth.domain.UserTokens;
import com.breadbolletguys.breadbread.auth.domain.request.LoginRequest;
import com.breadbolletguys.breadbread.auth.infrastructure.KakaoOAuthProvider;
import com.breadbolletguys.breadbread.auth.infrastructure.KakaoUserInfo;
import com.breadbolletguys.breadbread.auth.repository.RefreshTokenRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.UserRole;
import com.breadbolletguys.breadbread.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class LoginService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final KakaoOAuthProvider kakaoOAuthProvider;

    public UserTokens login(LoginRequest loginRequest) {
        String kakaoAccessToken = kakaoOAuthProvider.fetchKakaoAccessToken(loginRequest.getCode());
        KakaoUserInfo userInfo = kakaoOAuthProvider.getUserInfo(kakaoAccessToken);

        User user = findOrCreateUser(
                userInfo.getSocialLoginId(),
                userInfo.getNickname()
        );

        UserTokens userTokens = jwtUtil.createLoginToken(user.getId().toString());
        RefreshToken refreshToken = new RefreshToken(user.getId(), userTokens.getRefreshToken());
        refreshTokenRepository.save(refreshToken);
        return userTokens;
    }

    private User findOrCreateUser(String socialLoginId, String nickname) {
        return userRepository.findBySocialId(socialLoginId)
                .orElseGet(() -> createUser(socialLoginId, nickname));
    }

    private User createUser(String socialLoginId, String nickname) {
        String newNickname = generateNewUserNickname(socialLoginId, nickname);
        log.info("new nickname={}", newNickname);
        return userRepository.save(
                User.builder()
                        .socialId(socialLoginId)
                        .name(nickname)
                        .userRole(UserRole.BUYER)
                        .noticeCheck(true)
                        .deleted(false)
                        .build()
        );
    }

    private String generateNewUserNickname(String socialLoginId, String nickname) {
        return nickname + "#" + socialLoginId;
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.deleteById(refreshToken);
    }

    public String reissueAccessToken(String refreshToken, String authHeader) {
        String accessToken = authHeader.split(" ")[1];

        jwtUtil.validateRefreshToken(refreshToken);
        if (jwtUtil.isAccessTokenValid(accessToken)) {
            return accessToken;
        }

        if (jwtUtil.isAccessTokenExpired(accessToken)) {
            RefreshToken foundRefreshToken = refreshTokenRepository.findById(refreshToken)
                    .orElseThrow(() -> new BadRequestException(ErrorCode.INVALID_REFRESH_TOKEN));
            return jwtUtil.reissueAccessToken(foundRefreshToken.getUserId().toString());
        }

        throw new BadRequestException(ErrorCode.FAILED_TO_VALIDATE_TOKEN);
    }
}
