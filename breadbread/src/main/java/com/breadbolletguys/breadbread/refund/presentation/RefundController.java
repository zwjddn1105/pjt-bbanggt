package com.breadbolletguys.breadbread.refund.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.common.model.PageInfo;
import com.breadbolletguys.breadbread.refund.application.RefundService;
import com.breadbolletguys.breadbread.refund.domain.RefundState;
import com.breadbolletguys.breadbread.refund.domain.dto.request.RefundConfirmRequest;
import com.breadbolletguys.breadbread.refund.domain.dto.request.RefundRequest;
import com.breadbolletguys.breadbread.refund.domain.dto.response.RefundResponse;
import com.breadbolletguys.breadbread.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/refunds")
public class RefundController {

    private final RefundService refundService;

    @PostMapping
    public ResponseEntity<Void> create(
            @AuthUser User user,
            @RequestBody RefundRequest refundRequest
    ) {
        Long refundId = refundService.save(user, refundRequest);
        return ResponseEntity.created(URI.create("/api/v1/refunds/" + refundId)).build();
    }

    @GetMapping
    public ResponseEntity<PageInfo<RefundResponse>> findAll(
            @AuthUser User user,
            @RequestParam RefundState state,
            @RequestParam(required = false) String pageToken
    ) {
        return ResponseEntity.ok(refundService.findAll(user, state, pageToken));
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> confirm(
            @AuthUser User user,
            @RequestBody RefundConfirmRequest refundConfirmRequest
    ) {
        refundService.confirm(user, refundConfirmRequest);
        return ResponseEntity.noContent().build();
    }
}
