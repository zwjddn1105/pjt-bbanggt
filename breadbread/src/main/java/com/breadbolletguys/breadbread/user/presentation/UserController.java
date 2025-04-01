package com.breadbolletguys.breadbread.user.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.dto.response.UserResponse;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserResponse> findById(@AuthUser User user) {
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
