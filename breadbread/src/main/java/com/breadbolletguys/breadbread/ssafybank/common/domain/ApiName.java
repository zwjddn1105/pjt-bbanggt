package com.breadbolletguys.breadbread.ssafybank.common.domain;

import lombok.Getter;

@Getter
public enum ApiName {
    CREATE_ACCOUNT("createDemandDepositAccount"),
    INQUIRE_ACCOUNT("inquireDemandDepositList"),
    INQUIRE_ACCOUNT_LIST("inquireDemandDepositAccountList");

    private String apiName;

    ApiName(String apiName) {
        this.apiName = apiName;
    }
}
