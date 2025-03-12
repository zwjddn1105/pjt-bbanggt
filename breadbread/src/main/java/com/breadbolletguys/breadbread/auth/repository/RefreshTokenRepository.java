package com.breadbolletguys.breadbread.auth.repository;

import org.springframework.data.repository.CrudRepository;

import com.breadbolletguys.breadbread.auth.domain.RefreshToken;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
