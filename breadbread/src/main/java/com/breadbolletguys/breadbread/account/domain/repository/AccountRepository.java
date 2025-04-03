package com.breadbolletguys.breadbread.account.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.account.domain.Account;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AccountRepository {
    private final AccountJpaRepository accountJpaRepository;

    public Optional<Account> findByUserId(Long userId) {
        return accountJpaRepository.findByUserId(userId);
    }

    public void save(Account account) {
        accountJpaRepository.save(account);
    }

    public List<Account> findAllAccountNosByUserIds(List<Long> userIds) {
        return accountJpaRepository.findAllByUserIdIn(userIds);
    }

}
