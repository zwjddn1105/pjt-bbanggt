package com.breadbolletguys.breadbread.auth.resolver;

import java.util.Arrays;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.breadbolletguys.breadbread.auth.JwtUtil;
import com.breadbolletguys.breadbread.auth.annotation.AdminUser;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserArgumentResolver implements HandlerMethodArgumentResolver {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AdminUser.class);
    }

    @Override
    public User resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);

        if (request == null) {
            throw new BadRequestException(ErrorCode.FAILED_TO_VALIDATE_TOKEN);
        }

        String refreshToken = extractRefreshToken(request);
        String accessToken = extractAccessToken(request);

        if (jwtUtil.isAccessTokenValid(accessToken)) {
            User user = extractUser(accessToken);
            if (!user.isAdmin()) {
                throw new BadRequestException(ErrorCode.NOT_ADMIN_USER);
            }

            return user;
        }

        throw new BadRequestException(ErrorCode.FAILED_TO_VALIDATE_TOKEN);
    }

    private String extractAccessToken(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null) {
            throw new BadRequestException(ErrorCode.INVALID_ACCESS_TOKEN);
        }
        return authHeader.split(" ")[1];
    }

    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            throw new BadRequestException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("refresh-token"))
                .findFirst()
                .orElseThrow(() -> new BadRequestException(ErrorCode.INVALID_REFRESH_TOKEN))
                .getValue();
    }

    private User extractUser(String accessToken) {
        Long userId = Long.valueOf(jwtUtil.getSubject(accessToken));

        return userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.USER_NOT_FOUND));
    }
}
