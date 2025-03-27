package com.breadbolletguys.breadbread.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openApi() {
        Info info = new Info()
                .version("v1.0")
                .title("API Documentation")
                .description("breadbread api");
        return new OpenAPI()
                .info(info);
    }
}
