package com.breadbolletguys.breadbread.bakery.presentation;

import java.util.List;

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
        return ResponseEntity.ok(bakeryService.findByBakeryId(user, bakeryId));
    }

    @GetMapping("/bookmark")
    @Operation(description = "사용자가 좋아요를 누른 빵집 리스트 반환합니다.")
    public ResponseEntity<List<BakeryResponse>> getBookMarkBakery(@AuthUser User user) {
        return ResponseEntity.ok(bakeryService.getBookMarkBakery(user));
    }

    @PatchMapping("/{bakeryId}")
    @Operation(description = "빵집 id를 PathVariable 로 받아서 수정한다.")
    public ResponseEntity<BakeryResponse> modifyBakery(@AuthUser User user,
                                                       @PathVariable("bakeryId") Long bakeryId,
                                                       @RequestBody BakeryRequest bakeryRequest
    ) {
        bakeryService.updateBakery(user, bakeryId, bakeryRequest);
        return ResponseEntity.ok().build();
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
        return ResponseEntity.noContent().build();
    }
}
