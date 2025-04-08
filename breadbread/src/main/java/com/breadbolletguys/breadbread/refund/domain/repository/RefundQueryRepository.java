package com.breadbolletguys.breadbread.refund.domain.repository;

import java.util.List;

import com.breadbolletguys.breadbread.refund.domain.RefundState;
import com.breadbolletguys.breadbread.refund.domain.dto.response.RefundResponse;

public interface RefundQueryRepository {
    List<RefundResponse> findBySellerIdAndState(
            Long sellerId,
            RefundState state,
            int pageSize,
            String pageToken
    );
}
