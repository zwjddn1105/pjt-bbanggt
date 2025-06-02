package com.breadbolletguys.breadbread.order.infrasture;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.order.domain.Order;
import com.breadbolletguys.breadbread.order.domain.repository.OrderRepository;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.Payment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Transactional
@RequiredArgsConstructor
public class PaymentValidator {
    private final IamportClient iamportClient;
    private final OrderRepository orderRepository;

    public void validatePayment(Long orderId, String impUid) {
        try {
            log.info("ImpUID : {}", impUid);
            Payment payment = iamportClient.paymentByImpUid(impUid).getResponse();
            log.info("Payment : {}", payment);
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new NotFoundException(ErrorCode.ORDER_NOT_FOUND));

            BigDecimal price = BigDecimal.valueOf(order.getPrice());
            BigDecimal discount = BigDecimal.valueOf(order.getDiscount());
            if (!payment.getImpUid().equals(impUid)) {
                throw new BadRequestException(ErrorCode.INVALID_IMP_UID);
            }
            int expectedAmount = price.multiply(BigDecimal.ONE.subtract(discount))
                    .setScale(0, RoundingMode.DOWN)
                    .intValue();
            if (payment.getAmount().intValue() != expectedAmount) {
                throw new BadRequestException(ErrorCode.INVALID_PAYMENT_AMOUNT);
            }
        } catch (Exception e) {
            log.error("아임포트 요청 중 예외 발생: {}", e.getMessage(), e);
            throw new BadRequestException(ErrorCode.IAMPORT_REQUEST_FAILED);
        }
    }

}
