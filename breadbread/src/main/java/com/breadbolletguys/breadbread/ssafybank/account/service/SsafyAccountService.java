package com.breadbolletguys.breadbread.ssafybank.account.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.breadbolletguys.breadbread.common.exception.SsafyApiException;
import com.breadbolletguys.breadbread.ssafybank.account.dto.CreateAccountRequestDto;
import com.breadbolletguys.breadbread.ssafybank.account.request.CreateAccountRequest;
import com.breadbolletguys.breadbread.ssafybank.account.request.FindAccountProductRequest;
import com.breadbolletguys.breadbread.ssafybank.account.response.CreateAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.common.domain.ApiName;
import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;
import com.breadbolletguys.breadbread.ssafybank.common.response.SsafyBankErrorResponse;
import com.breadbolletguys.breadbread.ssafybank.common.util.SsafyBankUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SsafyAccountService {
    private static final String accountTypeUniqueNo = "001-1-5fbcac95e9a34e";

    private final SsafyBankUtil ssafyBankUtil;

    public FindAccountResponse findAccount() {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();
        var header = SsafyBankRequestHeader.of(ApiName.INQUIRE_ACCOUNT, apiKey, null);
        FindAccountProductRequest findAccountProductRequest = new FindAccountProductRequest(header);

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositList")
            .body(findAccountProductRequest)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                    .lines()
                    .collect(Collectors.joining("\n"));
                ObjectMapper mapper = new ObjectMapper();

                SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
            })
            .body(FindAccountResponse.class);
    }

    public CreateAccountResponse createAccount(CreateAccountRequestDto req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();

        var header = SsafyBankRequestHeader.of(ApiName.CREATE_ACCOUNT, apiKey, req.userKey());
        var createAccountRequest = new CreateAccountRequest(header, accountTypeUniqueNo);
        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount")
            .body(createAccountRequest)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                    .lines()
                    .collect(Collectors.joining("\n"));
                ObjectMapper mapper = new ObjectMapper();

                SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
            })
            .body(CreateAccountResponse.class);
    }
}
