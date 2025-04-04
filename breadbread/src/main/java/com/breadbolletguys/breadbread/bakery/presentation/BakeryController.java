package com.breadbolletguys.breadbread.bakery.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.bakery.application.BakeryService;
import com.breadbolletguys.breadbread.bakery.domain.dto.request.BakeryRequest;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;
import com.breadbolletguys.breadbread.user.domain.User;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/bakery")
@RequiredArgsConstructor
@Slf4j
public class BakeryController {
    private final BakeryService bakeryService;

    @PostMapping("/createBakery")
    @Operation(description = "빵집 정보를 입력받고 생성한다.")
    public ResponseEntity<Void> createBakery(@AuthUser User user, @RequestBody BakeryRequest bakeryRequest) {
        bakeryService.save(user, bakeryRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{bakeryId}")
    @Operation(description = "빵집 id를 PathVariable 로 받아서 조회한다.")
    public ResponseEntity<BakeryResponse> getBakeryById(@AuthUser User user,
                                                        @PathVariable("bakeryId") Long bakeryId) {
        return ResponseEntity.ok(bakeryService.findByBakeryId(bakeryId));
    }

    @PatchMapping("/{bakeryId}")
    @Operation(description = "빵집 id를 PathVariable 로 받아서 수정한다.")
    public ResponseEntity<BakeryResponse> modifyBakery(@AuthUser User user,
                                                       @PathVariable("bakeryId") Long bakeryId,
                                                       @RequestBody BakeryRequest bakeryRequest
    ) {
        return ResponseEntity.ok(bakeryService.updateBakery(user, bakeryId, bakeryRequest));
    }

    @GetMapping("/{bakeryId}/bookmark")
    @Operation(description = "빵집 id를 PathVariable 로 북마크 등록했는지 확인한다. (등록 존재 : true, 등록 존재하지 않음 : false)")
    public ResponseEntity<Boolean> getBookMark(@AuthUser User user,
                                               @PathVariable("bakeryId") Long bakeryId) {
        return ResponseEntity.ok(bakeryService.hasBookmark(user, bakeryId));
    }

    @PostMapping("/{bakeryId}/bookmark")
    @Operation(description = "빵집 id를 PathVariable 로 북마크 등록한다.")
    public ResponseEntity<Void> createBookmark(@AuthUser User user,
                                               @PathVariable("bakeryId") Long bakeryId) {
        bakeryService.addBookmark(user, bakeryId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{bakeryId}/bookmark")
    @Operation(description = "빵집 id를 PathVariable 로 북마크 삭제한다.")
    public ResponseEntity<Void> deleteBookmark(@AuthUser User user,
                                               @PathVariable("bakeryId") Long bakeryId) {
        bakeryService.removeBookmark(user, bakeryId);
        return ResponseEntity.ok().build();
    }
}
