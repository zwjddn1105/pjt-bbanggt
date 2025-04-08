package com.breadbolletguys.breadbread.refund.domain.dto.response;

import java.time.LocalDateTime;

public record RefundResponse(
        Long refundId,
        Long orderId,
        String vendingMachineName,
        String customerName,
        LocalDateTime createdAt,
        int refundPrice
) {
}
