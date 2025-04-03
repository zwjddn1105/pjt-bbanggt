package com.client.httpclient1;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Component
public class RestClientExample {
    @Value("${spring.user.apiKey}")
    private String apiKey;

    private static String myEmail = "qoraudrb123@gmail.com";

    public ApiKeyResponse getApiKey() {
        RestClient restClient = RestClient.create();

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/edu/app/issuedApiKey")
            .contentType(APPLICATION_JSON)
            .body(new ApiKeyRequest(myEmail))
            .retrieve()
            .body(ApiKeyResponse.class);
    }


    public CreateAccountResponse createAccount(
        String userId
    ) {
        RestClient restClient = RestClient.create();

        return restClient.post()
            .uri("https://finopenapi.ssafy.io/ssafy/api/v1/member/")
            .body(new CreateAccountRequest(apiKey, userId))
            .retrieve()
            .body(CreateAccountResponse.class);
    }
}
