package com.breadbolletguys.breadbread.ssafybank.common.domain;

import lombok.Getter;

@Getter
public enum ApiName {
    CREATE_ACCOUNT("createDemandDepositAccount"),
    INQUIRE_DEPOSIT_LIST("inquireDemandDepositList"),
    INQUIRE_ACCOUNT_LIST("inquireDemandDepositAccountList"),
    WITHDRAW_ACCOUNT("updateDemandDepositAccountWithdrawal"),
    DEPOSIT_ACCOUNT("updateDemandDepositAccountDeposit");

    private String apiName;
    ApiName(String apiName) {
        this.apiName = apiName;
    }
}
