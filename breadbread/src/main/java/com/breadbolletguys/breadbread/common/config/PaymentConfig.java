package com.breadbolletguys.breadbread.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.siot.IamportRestClient.IamportClient;

@Configuration
public class PaymentConfig {

    @Value("${iamport.key}")
    private String restApiKey;

    @Value("${iamport.secret}")
    private String restApiSecret;

    @Bean
    public IamportClient iamportClient() {
        return new IamportClient(restApiKey, restApiSecret);
    }
}