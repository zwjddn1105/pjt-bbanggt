package com.breadbolletguys.breadbread.image.domain.repository;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.image.domain.NftImage;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class NftImageRepository {
    private final NftImageJpaRepository nftImageJpaRepository;

    public void save(NftImage nftImage) {
        nftImageJpaRepository.save(nftImage);
    }

    public String findImageByOrderId(Long orderId) {
        return nftImageJpaRepository.findImageByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.NFT_IMAGE_NOT_FOUND));
    }
}
