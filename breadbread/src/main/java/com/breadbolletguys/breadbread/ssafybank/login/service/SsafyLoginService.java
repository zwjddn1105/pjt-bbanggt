package com.breadbolletguys.breadbread.ssafybank.login.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.breadbolletguys.breadbread.ssafybank.common.util.SsafyBankUtil;
import com.breadbolletguys.breadbread.ssafybank.login.service.dto.SsafyUserIdDto;
import com.breadbolletguys.breadbread.ssafybank.login.service.request.CreateSsafyUserRequest;
import com.breadbolletguys.breadbread.ssafybank.login.service.response.CreateSsafyUserResponse;
import com.breadbolletguys.breadbread.ssafybank.login.service.response.FindSsafyUserResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SsafyLoginService {
    private final SsafyBankUtil ssafyBankUtil;

    public CreateSsafyUserResponse createSsafyUser(SsafyUserIdDto req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/member/")
            .body(new CreateSsafyUserRequest(apiKey, req.userId()))
            .retrieve()
            .body(CreateSsafyUserResponse.class);
    }

    public FindSsafyUserResponse findSsafyUser(SsafyUserIdDto req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/member/search")
            .body(new CreateSsafyUserRequest(apiKey, req.userId()))
            .retrieve()
            .body(FindSsafyUserResponse.class);
    }
}
