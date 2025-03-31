package com.breadbolletguys.breadbread.common.aop;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import com.breadbolletguys.breadbread.common.annotation.RedisLock;
import com.breadbolletguys.breadbread.common.util.CSpringExpressionParser;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RedisLockAop {
    private static final String REDIS_LOCK_PREFIX = "LOCK:";

    private final RedissonClient redissonClient;

    @Around("@annotation(com.breadbolletguys.breadbread.common.annotation.RedisLock)")
    public Object lock(final ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RedisLock distributedLock = method.getAnnotation(RedisLock.class);

        String key = REDIS_LOCK_PREFIX + CSpringExpressionParser.getDynamicValue(
                signature.getParameterNames(),
                joinPoint.getArgs(),
                distributedLock.key()
        );
        RLock rLock = redissonClient.getLock(key);

        try {
            boolean available = rLock.tryLock(
                    distributedLock.waitTime(),
                    distributedLock.leaseTime(),
                    distributedLock.timeUnit()
            );
            if (!available) {
                return false;
            }
            return joinPoint.proceed();
        } catch (InterruptedException e) {
            throw new InterruptedException();
        } finally {
            try {
            } catch (IllegalMonitorStateException e) {
                log.info("Lock Already UnLock {} {}", method.getName(), key);
            }
        }
    }
}
