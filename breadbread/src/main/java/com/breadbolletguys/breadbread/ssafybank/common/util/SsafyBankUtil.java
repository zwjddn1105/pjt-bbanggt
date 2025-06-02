package com.breadbolletguys.breadbread.ssafybank.common.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SsafyBankUtil {
    public final String managerId;
    public final String userApiKey;

    private SsafyBankUtil(
        @Value("${app.user.managerId}") final String managerId,
        @Value("${app.user.apiKey}") final String apiKey
    ) {
        this.managerId = managerId;
        this.userApiKey = apiKey;
    }
}
