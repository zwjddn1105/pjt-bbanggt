package com.breadbolletguys.breadbread.bakery.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.bakery.application.BakeryService;
import com.breadbolletguys.breadbread.bakery.domain.dto.request.BakeryRequest;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/bakery")
@RequiredArgsConstructor
@Slf4j
public class BakeryController {
    private final BakeryService bakeryService;

    @PostMapping("/createBakery")
    public ResponseEntity<Void> createBakery(@AuthUser User user, @RequestBody BakeryRequest bakeryRequest) {
        bakeryService.save(user, bakeryRequest);
        return ResponseEntity.ok().build();
    }
}
