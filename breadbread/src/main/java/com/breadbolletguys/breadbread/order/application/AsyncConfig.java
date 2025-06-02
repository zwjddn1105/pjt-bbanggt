package com.breadbolletguys.breadbread.order.application;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    private static final int CORE_POOL_SIZE = 100;
    private static final int MAX_POOL_SIZE = 100;
    private static final int QUEUE_CAPACITY = 200;

    @Bean(name = "ipfsExecutor")
    public Executor ipfsExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(CORE_POOL_SIZE);
        executor.setMaxPoolSize(MAX_POOL_SIZE);
        executor.setQueueCapacity(QUEUE_CAPACITY);
        executor.setThreadNamePrefix("ipfsExecutor-");
        executor.initialize();
        return executor;
    }
}
