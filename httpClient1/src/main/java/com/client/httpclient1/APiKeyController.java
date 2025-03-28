package com.client.httpclient1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class APiKeyController {
    private final RestClientExample restClientExample;

    @GetMapping
    public ResponseEntity<ApiKeyResponse> getApiKey() {
        ApiKeyResponse apiKey = restClientExample.getApiKey();
        return ResponseEntity.ok(apiKey);
    }

    @PostMapping
    public ResponseEntity<CreateAccountResponse> createAccount(
        @RequestBody CreateAccountRequest req
    ) {
        CreateAccountResponse response = restClientExample.createAccount(req.userId());
        return ResponseEntity.ok(response);
    }
}
