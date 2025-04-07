package com.breadbolletguys.breadbread.order.infrasture;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.Payment;

import lombok.RequiredArgsConstructor;

@Component
@Transactional
@RequiredArgsConstructor
public class PaymentValidator {
    private final IamportClient iamportClient;
    private final OrderRepository orderRepository;

    public void validatePayment(Long orderId, String impUid) {
        try {
            Payment payment = iamportClient.paymentByImpUid(impUid).getResponse();
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));

            BigDecimal price = BigDecimal.valueOf(order.getPrice());
            BigDecimal discount = BigDecimal.valueOf(order.getDiscount());
            if (!payment.getImpUid().equals(impUid)) {
                throw new IllegalArgumentException("ImpUID가 일치하지 않습니다.");
            }
            int expectedAmount = price.multiply(BigDecimal.ONE.subtract(discount))
                    .setScale(0, RoundingMode.DOWN)
                    .intValue();
            if (payment.getAmount().intValue() != expectedAmount) {
                throw new IllegalArgumentException("결제 금액이 일치하지 않습니다.");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("IamPort 사용 시 오류 발생");
        }
    }

}
