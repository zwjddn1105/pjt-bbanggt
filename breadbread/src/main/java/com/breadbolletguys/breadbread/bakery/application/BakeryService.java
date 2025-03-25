package com.breadbolletguys.breadbread.bakery.application;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.dto.request.BakeryRequest;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class BakeryService {
    private final BakeryRepository bakeryRepository;

    public void save(User user, BakeryRequest bakeryRequest) {
        Bakery bakery = Bakery.builder()
                .userId(user.getId())
                .name(bakeryRequest.getName())
                .businessNumber(bakeryRequest.getBusinessNumber())
                .homepageUrl(bakeryRequest.getHomepageUrl())
                .address(bakeryRequest.getAddress())
                .phone(bakeryRequest.getPhone())
                .authenticationDate(LocalDateTime.now())
                .authenticated(true)
                .reviewCount(0)
                .averageScore(0.0)
                .build();
        bakeryRepository.save(bakery);
    }
}