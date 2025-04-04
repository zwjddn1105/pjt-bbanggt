package com.breadbolletguys.breadbread.account.application;

import java.util.ArrayList;
import java.util.List;


import org.springframework.stereotype.Service;

import com.breadbolletguys.breadbread.account.domain.Account;
import com.breadbolletguys.breadbread.account.domain.dto.response.AccountResponse;
import com.breadbolletguys.breadbread.account.domain.repository.AccountRepository;
import com.breadbolletguys.breadbread.ssafybank.account.dto.UserAccountDto;
import com.breadbolletguys.breadbread.ssafybank.account.request.CreateAccountRequest;
import com.breadbolletguys.breadbread.ssafybank.account.request.SingleAccountRequest;
import com.breadbolletguys.breadbread.ssafybank.account.response.CreateAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindUserAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.response.FindUserSingleAccountResponse;
import com.breadbolletguys.breadbread.ssafybank.account.service.SsafyAccountService;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AccountService {

    private final SsafyAccountService ssafyAccountService;
    private final AccountRepository accountRepository;

    public void createAccount(User user) {
        CreateAccountRequest createAccountRequest = new CreateAccountRequest(user.getUserKey());
        CreateAccountResponse createAccountResponse = ssafyAccountService.createAccount(createAccountRequest);
        Account account = Account.builder()
                        .userId(user.getId())
                        .accountNo(createAccountResponse.REC().accountNo())
                        .build();
        accountRepository.save(account);
    }

    public List<AccountResponse> getAccountList(User user) {
        CreateAccountRequest createAccountRequest = new CreateAccountRequest(user.getUserKey());
        FindUserAccountResponse findUserAccountResponse = ssafyAccountService.findUserAccount(createAccountRequest);
        List<AccountResponse> responses = new ArrayList<>();
        for (UserAccountDto userAccountDto : findUserAccountResponse.REC()) {
            responses.add(new AccountResponse(
                    userAccountDto.bankName(),
                    userAccountDto.accountNo(),
                    userAccountDto.accountBalance()
            ));
        }
        return responses;
    }

    public AccountResponse getSingleAccount(User user, String accountNo) {
        SingleAccountRequest singleAccountRequest = new SingleAccountRequest(user.getUserKey(), accountNo);
        FindUserSingleAccountResponse findUserSingleAccountResponse =
                ssafyAccountService.findUserSingleAccount(singleAccountRequest);
        return new AccountResponse(
                findUserSingleAccountResponse.REC().bankName(),
                findUserSingleAccountResponse.REC().accountNo(),
                findUserSingleAccountResponse.REC().accountBalance());
    }

}
