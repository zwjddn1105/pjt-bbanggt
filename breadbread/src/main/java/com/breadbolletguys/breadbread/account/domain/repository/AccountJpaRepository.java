package com.breadbolletguys.breadbread.account.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.account.domain.Account;

public interface AccountJpaRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUserId(Long userId);

    List<Account> findAllByUserIdIn(List<Long> userIds);
}
