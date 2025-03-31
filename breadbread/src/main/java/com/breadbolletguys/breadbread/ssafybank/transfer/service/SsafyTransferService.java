package com.breadbolletguys.breadbread.ssafybank.transfer.service;

import com.breadbolletguys.breadbread.common.exception.SsafyApiException;
import com.breadbolletguys.breadbread.ssafybank.account.request.FindProductSsafyApiRequest;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.common.domain.ApiName;
import com.breadbolletguys.breadbread.ssafybank.common.request.SsafyBankRequestHeader;
import com.breadbolletguys.breadbread.ssafybank.common.response.SsafyBankErrorResponse;
import com.breadbolletguys.breadbread.ssafybank.common.util.SsafyBankUtil;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountDepositRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountWithdrawRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountWithdrawSsafyApiRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.response.AccountDepositSsafyApiResponse;
import com.breadbolletguys.breadbread.ssafybank.transfer.response.AccountWithdrawSsafyApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SsafyTransferService {
    private static final String accountTypeUniqueNo = "001-1-5fbcac95e9a34e";

    private final SsafyBankUtil ssafyBankUtil;

    public AccountWithdrawSsafyApiResponse accountWithdraw(AccountWithdrawRequest req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();
        var header = SsafyBankRequestHeader.of(ApiName.WITHDRAW_ACCOUNT, apiKey, req.userKey());
        var accountWithdrawReq = new AccountWithdrawSsafyApiRequest(
            header,
            req.accountNo(),
            req.transactionBalance(),
            req.transactionSummary());

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountWithdrawal")
            .body(accountWithdrawReq)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                    .lines()
                    .collect(Collectors.joining("\n"));
                ObjectMapper mapper = new ObjectMapper();

                SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
            })
            .body(AccountWithdrawSsafyApiResponse.class);
    }

    public AccountDepositSsafyApiResponse accountDeposit(AccountDepositRequest req) {
        String apiKey = ssafyBankUtil.userApiKey;

        RestClient restClient = RestClient.create();
        var header = SsafyBankRequestHeader.of(ApiName.DEPOSIT_ACCOUNT, apiKey, req.userKey());
        var accountDepositReq = new AccountWithdrawSsafyApiRequest(
            header,
            req.accountNo(),
            req.transactionBalance(),
            req.transactionSummary());

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountDeposit")
            .body(accountDepositReq)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (reqSpec, res) -> {
                String errorBody = new BufferedReader(new InputStreamReader(res.getBody()))
                    .lines()
                    .collect(Collectors.joining("\n"));
                ObjectMapper mapper = new ObjectMapper();

                SsafyBankErrorResponse errorResponse = mapper.readValue(errorBody, SsafyBankErrorResponse.class);
                throw new SsafyApiException(errorResponse.responseCode(), errorResponse.responseMessage());
            })
            .body(AccountDepositSsafyApiResponse.class);
    }
}
