package com.breadbolletguys.breadbread.user.application;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.breadbolletguys.breadbread.account.domain.Account;
import com.breadbolletguys.breadbread.account.domain.repository.AccountRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountTransferRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.service.SsafyTransferService;
import com.breadbolletguys.breadbread.transaction.application.TransactionService;
import com.breadbolletguys.breadbread.transaction.domain.TransactionStatus;
import com.breadbolletguys.breadbread.transaction.domain.TransactionType;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    @Value("${app.admin.userId}")
    private String adminId;

    @Value("${app.admin.userKey}")
    private String adminKey;

    @Value("${app.admin.account}")
    private String adminAccount;

    private final AccountRepository accountRepository;
    private final SsafyTransferService ssafyTransferService;
    private final TransactionService transactionService;

    public void payForTicket(User user, String accountNo) {
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (!accountNo.equals(account.getAccountNo())) {
            throw new BadRequestException(ErrorCode.NOT_OWNED_ACCOUNT_ERROR);
        }

        AccountTransferRequest accountTransferRequest = new AccountTransferRequest(
                user.getUserKey(),
                adminAccount,
                "입금",
                1L,
                account.getAccountNo(),
                "송금"
        );
        ssafyTransferService.accountTransfer(accountTransferRequest);
        user.purchaseTicket();
        transactionService.recordTransaction(
                null,
                account.getAccountNo(),
                adminAccount,
                100L,
                TransactionType.TICKET_PURCHASE,
                TransactionStatus.PURCHASE
        );
    }
}
