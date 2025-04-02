package com.breadbolletguys.breadbread.vendingmachine.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.vendingmachine.application.SpaceService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/spaces")
public class SpaceController {

    private final SpaceService spaceService;

    @PostMapping("/{spaceId}/buy")
    @Operation(description = "사장님이 자판기의 특정 칸을 구매하는 api")
    public ResponseEntity<Void> buySpace(
            @AuthUser User user,
            @PathVariable(name = "spaceId") Long spaceId
    ) {
        spaceService.save(user, spaceId);
        return ResponseEntity.ok().build();
    }
}
