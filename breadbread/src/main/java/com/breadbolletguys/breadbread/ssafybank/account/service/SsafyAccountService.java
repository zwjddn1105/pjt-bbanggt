package com.breadbolletguys.breadbread.ssafybank.account.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;


import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.breadbolletguys.breadbread.common.exception.SsafyApiException;
import com.breadbolletguys.breadbread.ssafybank.account.request.CreateAccountRequest;
import com.breadbolletguys.breadbread.ssafybank.account.request.CreateAccountSsafyApiRequest;
import com.breadbolletguys.breadbread.ssafybank.account.request.FindProductSsafyApiRequest;
import com.breadbolletguys.breadbread.ssafybank.account.request.FindUserAccountRequest;
import com.breadbolletguys.breadbread.ssafybank.account.request.SingleAccountRequest;
import com.breadbolletguys.breadbread.ssafybank.account.request.SingleAccountSsafyApiRequest;
import com.breadbolletguys.breadbread.ssafybank.account.response.CreateAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindUserAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindUserSingleAccountResponse;
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

    public FindAccountResponse findProductAccount() {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();
        var header = SsafyBankRequestHeader.of(ApiName.INQUIRE_DEPOSIT_LIST, apiKey, null);
        FindProductSsafyApiRequest findProductSsafyApiRequest = new FindProductSsafyApiRequest(header);

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositList")
            .body(findProductSsafyApiRequest)
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

    public CreateAccountResponse createAccount(CreateAccountRequest req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();

        var header = SsafyBankRequestHeader.of(ApiName.CREATE_ACCOUNT, apiKey, req.userKey());
        var createAccountSsafyApiRequest = new CreateAccountSsafyApiRequest(header, accountTypeUniqueNo);
        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount")
            .body(createAccountSsafyApiRequest)
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

    public FindUserAccountResponse findUserAccount(CreateAccountRequest req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();
        var header = SsafyBankRequestHeader.of(ApiName.INQUIRE_ACCOUNT_LIST, apiKey, req.userKey());
        var findUserAccountRequest = new FindUserAccountRequest(header);
        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountList")
            .body(findUserAccountRequest)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                    .lines()
                    .collect(Collectors.joining("\n"));
                ObjectMapper mapper = new ObjectMapper();

                SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
            })
            .body(FindUserAccountResponse.class);
    }

    public FindUserSingleAccountResponse findUserSingleAccount(SingleAccountRequest req) {
        String apiKey = ssafyBankUtil.userApiKey;
        RestClient restClient = RestClient.create();
        var header = SsafyBankRequestHeader.of(ApiName.INQUIRE_ACCOUNT, apiKey, req.userKey());
        var singleAccountSsafyApiRequest = new SingleAccountSsafyApiRequest(header, req.accountNo());

        return restClient.post()
                .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccount")
                .body(singleAccountSsafyApiRequest)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                    String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                            .lines()
                            .collect(Collectors.joining("\n"));
                    ObjectMapper mapper = new ObjectMapper();

                    SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                    throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
                })
                .body(FindUserSingleAccountResponse.class);
    }
}
