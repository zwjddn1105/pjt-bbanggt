package com.breadbolletguys.breadbread.auth.domain.request;

import com.breadbolletguys.breadbread.auth.domain.Environment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String code;
    private Environment environment;
}
