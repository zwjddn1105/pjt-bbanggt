package com.breadbolletguys.breadbread.refund.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.refund.domain.Refund;
import com.breadbolletguys.breadbread.refund.domain.RefundState;
import com.breadbolletguys.breadbread.refund.domain.dto.response.RefundResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RefundRepository {

    private static final int DEFAULT_PAGE_SIZE = 10;

    private final RefundJpaRepository refundJpaRepository;

    public boolean existsByOrderIdAndCustomerId(Long orderId, Long customerId) {
        return refundJpaRepository.existsByOrderIdAndCustomerId(orderId, customerId);
    }

    public Refund save(Refund refund) {
        return refundJpaRepository.save(refund);
    }

    public PageInfo<RefundResponse> findBySellerIdAndState(Long sellerId, RefundState state, String pageToken) {
        var data = refundJpaRepository.findBySellerIdAndState(sellerId, state, DEFAULT_PAGE_SIZE, pageToken);
        return PageInfo.of(data, DEFAULT_PAGE_SIZE, RefundResponse::refundId);
    }

    public Optional<Refund> findById(Long id) {
        return refundJpaRepository.findById(id);
    }
}
