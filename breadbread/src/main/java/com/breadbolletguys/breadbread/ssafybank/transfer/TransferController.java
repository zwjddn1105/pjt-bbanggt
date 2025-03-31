package com.breadbolletguys.breadbread.ssafybank.transfer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountDepositRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountHistoryRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountTransferRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.request.AccountWithdrawRequest;
import com.breadbolletguys.breadbread.ssafybank.transfer.response.AccountDepositSsafyApiResponse;
import com.breadbolletguys.breadbread.ssafybank.transfer.response.AccountHistorySsafyApiResponse;
import com.breadbolletguys.breadbread.ssafybank.transfer.response.AccountTransferSsafyApiResponse;
import com.breadbolletguys.breadbread.ssafybank.transfer.response.AccountWithdrawSsafyApiResponse;
import com.breadbolletguys.breadbread.ssafybank.transfer.service.SsafyTransferService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ssafy/transfer")
@RequiredArgsConstructor
public class TransferController {
    private final SsafyTransferService ssafyTransferService;

    @PostMapping("/withdraw")
    public ResponseEntity<AccountWithdrawSsafyApiResponse> withdrawAccount(
        @RequestBody AccountWithdrawRequest accountWithdrawRequest
    ) {
        AccountWithdrawSsafyApiResponse response = ssafyTransferService.accountWithdraw(accountWithdrawRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deposit")
    public ResponseEntity<AccountDepositSsafyApiResponse> withdrawAccount(
        @RequestBody AccountDepositRequest accountDepositRequest
    ) {
        AccountDepositSsafyApiResponse response = ssafyTransferService.accountDeposit(accountDepositRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<AccountTransferSsafyApiResponse> transferAccount(
        @RequestBody AccountTransferRequest accountTransferRequest
    ) {
        AccountTransferSsafyApiResponse response = ssafyTransferService.accountTransfer(accountTransferRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<AccountHistorySsafyApiResponse> transferAccount(
        @RequestBody AccountHistoryRequest accountHistoryRequest
    ) {
        AccountHistorySsafyApiResponse response = ssafyTransferService.accountHistory(accountHistoryRequest);
        return ResponseEntity.ok(response);
    }
}
