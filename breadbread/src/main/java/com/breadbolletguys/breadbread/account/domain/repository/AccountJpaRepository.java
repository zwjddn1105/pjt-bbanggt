package com.breadbolletguys.breadbread.account.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.account.domain.Account;


@Repository
public interface AccountJpaRepository extends JpaRepository<Account, Long> {
}
