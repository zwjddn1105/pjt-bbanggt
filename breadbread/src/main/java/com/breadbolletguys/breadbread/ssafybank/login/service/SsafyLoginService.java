package com.breadbolletguys.breadbread.ssafybank.login.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.breadbolletguys.breadbread.common.exception.SsafyApiException;
import com.breadbolletguys.breadbread.ssafybank.common.response.SsafyBankErrorResponse;
import com.breadbolletguys.breadbread.ssafybank.common.util.SsafyBankUtil;
import com.breadbolletguys.breadbread.ssafybank.login.request.UserCreateRequest;
import com.breadbolletguys.breadbread.ssafybank.login.request.UserCreateSsafyApiRequest;
import com.breadbolletguys.breadbread.ssafybank.login.response.CreateUserSsafyApiResponse;
import com.breadbolletguys.breadbread.ssafybank.login.response.FindSsafyUserResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SsafyLoginService {
    private final SsafyBankUtil ssafyBankUtil;

    public CreateUserSsafyApiResponse createSsafyUser(UserCreateRequest req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/member/")
            .body(new UserCreateSsafyApiRequest(apiKey, req.userId()))
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                    .lines()
                    .collect(Collectors.joining("\n"));
                ObjectMapper mapper = new ObjectMapper();

                SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
            })
            .body(CreateUserSsafyApiResponse.class);
    }

    public FindSsafyUserResponse findSsafyUser(UserCreateRequest req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/member/search")
            .body(new UserCreateSsafyApiRequest(apiKey, req.userId()))
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                    .lines()
                    .collect(Collectors.joining("\n"));
                ObjectMapper mapper = new ObjectMapper();

                SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
            })
            .body(FindSsafyUserResponse.class);
    }
}
