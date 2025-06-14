package com.breadbolletguys.breadbread.user.application;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.account.domain.Account;
import com.breadbolletguys.breadbread.account.domain.repository.AccountRepository;
import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountTransferRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.service.SsafyTransferService;
import com.breadbolletguys.breadbread.transaction.application.TransactionService;
import com.breadbolletguys.breadbread.transaction.domain.TransactionStatus;
import com.breadbolletguys.breadbread.transaction.domain.TransactionType;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.dto.request.TicketPurchaseRequest;
import com.breadbolletguys.breadbread.user.domain.dto.response.UserResponse;
import com.breadbolletguys.breadbread.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    @Value("${app.admin.userId}")
    private String adminId;

    @Value("${app.admin.userKey}")
    private String adminKey;

    @Value("${app.admin.account}")
    private String adminAccount;

    private final AccountRepository accountRepository;
    private final BakeryRepository bakeryRepository;
    private final SsafyTransferService ssafyTransferService;
    private final TransactionService transactionService;

    public UserResponse getMyInfo(User user) {
        Bakery bakery = bakeryRepository.findByUserId(user.getId())
                .orElse(null);
        return UserResponse.from(user, bakery);
    }

    public void payForTicket(User user, TicketPurchaseRequest ticketPurchaseRequest) {
        int ticketCount = ticketPurchaseRequest.getCount();
        countValidation(ticketCount);
        long amount = 100L * ticketCount;
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                user.getUserKey(),
                adminAccount,
                "입금",
                amount / 100,
                account.getAccountNo(),
                "송금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
        user.purchaseTicket(ticketCount);
        transactionService.recordTransaction(
                null,
                account.getAccountNo(),
                adminAccount,
                100L,
                TransactionType.TICKET_PURCHASE,
                TransactionStatus.PURCHASE
        );
    }

    private void countValidation(int count) {
        if (count <= 0 || count > 100) {
            throw new BadRequestException(ErrorCode.INVALID_TICKET_PURCHASE_COUNT);
        }
    }

    @Transactional
    public void toggle(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.USER_NOT_FOUND));

        user.toggleNotice();
    }
}
