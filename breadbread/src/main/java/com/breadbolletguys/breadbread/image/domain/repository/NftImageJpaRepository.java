package com.breadbolletguys.breadbread.image.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.breadbolletguys.breadbread.image.domain.NftImage;

public interface NftImageJpaRepository extends JpaRepository<NftImage, Long> {
    Optional<String> findImageByOrderId(Long orderId);

}
