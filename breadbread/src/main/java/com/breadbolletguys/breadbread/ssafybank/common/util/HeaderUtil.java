package com.breadbolletguys.breadbread.ssafybank.common.util;

import org.apache.commons.lang3.RandomStringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class HeaderUtil {
    public static String getCurrentDate() {
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        return now.format(formatter);
    }

    public static String getCurrentTime() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HHmmss");

        return now.format(timeFormatter);
    }

    public static String getInstitutionTransactionUniqueNo() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

        String timeFormat = now.format(timeFormatter);
        String randomCode = RandomStringUtils.randomNumeric(6);
        return timeFormat + randomCode;
    }
}
