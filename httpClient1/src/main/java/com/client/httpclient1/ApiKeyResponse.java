package com.client.httpclient1;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public record ApiKeyResponse(
    String managerId,
    String apiKey,
    LocalDate createDate,
    LocalDate expirationDate
) {
    static ApiKeyResponse of(String managerId, String apiKey, String createDateStr, String expirationDateStr) {
        LocalDate createdDate = stringToDate(createDateStr);
        LocalDate expirationDate = stringToDate(expirationDateStr);

        return new ApiKeyResponse(managerId, apiKey, createdDate, expirationDate);
    }

    private static LocalDate stringToDate(String date) {
        String dateStr = "20250201";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        return LocalDate.parse(dateStr, formatter);
    }
}
