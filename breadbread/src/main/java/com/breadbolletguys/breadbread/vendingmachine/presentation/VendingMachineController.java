package com.breadbolletguys.breadbread.vendingmachine.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.auth.annotation.AdminUser;
import com.breadbolletguys.breadbread.auth.annotation.AuthUser;
import com.breadbolletguys.breadbread.image.application.S3Service;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.vendingmachine.application.VendingMachineCacheService;
import com.breadbolletguys.breadbread.vendingmachine.application.VendingMachineService;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.request.VendingMachineCreateJsonRequest;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineBuyerResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineResponse;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.response.VendingMachineSellerResponse;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

/**
 * Admin API
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/vending-machines")
public class VendingMachineController {

    private final VendingMachineCacheService vendingMachineCacheService;
    private final VendingMachineService vendingMachineService;
    private final S3Service s3Service;

    /**
     * 자판기 정보를 입력받고 저장한다.
     */
    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    @Operation(description = "어드민 전용 api, 자판기 정보를 입력받고 생성한다.")
    public ResponseEntity<Void> create(
            @AdminUser User user,
            @RequestPart("jsonRequest") VendingMachineCreateJsonRequest jsonRequest,
            @RequestPart("files") List<MultipartFile> files
    ) {
        var imageUrls = s3Service.uploadFiles(files);
        var vendingMachine = vendingMachineService.save(jsonRequest, imageUrls);
        vendingMachineCacheService.save(
                jsonRequest.latitude(),
                jsonRequest.longitude(),
                vendingMachine
        );

        return ResponseEntity.created(URI.create("/api/v1/vending-machines/" + vendingMachine.getId())).build();
    }

    /**
     * 자판기 Id를 받아서 삭제한다.
     */
    @DeleteMapping("/{vendingMachineId}")
    @Operation(description = "어드민 전용 api, 자판기 id를 pathVariable 로 받아서 삭제한다.")
    public ResponseEntity<Void> delete(
            @AdminUser User user,
            @PathVariable(name = "vendingMachineId") Long vendingMachineId
    ) {
        var vendingMachineRedisEntity = vendingMachineService.delete(vendingMachineId);
        vendingMachineCacheService.delete(vendingMachineRedisEntity);
        return ResponseEntity.noContent().build();
    }

    /**
     * 위경도 기반으로 distance 안에 있는 자판기를 조회한다.
     * @return : 자판기 Id, 위경도, 거리
     */
    @GetMapping
    @Operation(description = "위경도와 거리를 입력받아 현재 위치 기준으로 일정 거리 내의 자판기 리스트를 조회한다.")
    public ResponseEntity<List<VendingMachineResponse>> findAll(
            @AuthUser User user,
            @RequestParam(name = "latitude") Double latitude,
            @RequestParam(name = "longitude") Double longitude,
            @RequestParam(name = "distance", defaultValue = "3") Integer distance
    ) {
        return ResponseEntity.ok(
                vendingMachineCacheService.findNearByVendingMachine(
                        longitude,
                        latitude,
                        distance
                )
        );
    }

    @GetMapping("/bookmarked")
    @Operation(description = "위경도와 거리를 입력받아 현재 위치 기준으로 북마크한 빵집의 빵이 담긴 일정 거리 내의 자판기 리스트를 조회한다.")
    public ResponseEntity<List<VendingMachineResponse>> findAllByBookmark(
            @AuthUser User user,
            @RequestParam(name = "latitude") Double latitude,
            @RequestParam(name = "longitude") Double longitude,
            @RequestParam(name = "distance", defaultValue = "3") Integer distance
    ) {
        return ResponseEntity.ok(
                vendingMachineCacheService.findNearByAndBookmarkVendingMachine(
                        user,
                        longitude,
                        latitude,
                        distance
                )
        );
    }

    @PostMapping("/warm-up")
    @Operation(description = "어드민 전용 api, 최초 서버를 오픈할 때 cache warm-up 용도이다.")
    public ResponseEntity<Void> warpUp(@AdminUser User user) {
        vendingMachineCacheService.warmUp();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buyer/{vendingMachineId}")
    public ResponseEntity<VendingMachineBuyerResponse> findVendingMachineForBuyer(
            @AuthUser User user,
            @PathVariable(name = "vendingMachineId") Long vendingMachineId
    ) {
        return ResponseEntity.ok(vendingMachineService.findVendingMachineForBuyer(user, vendingMachineId));
    }

    @GetMapping("/seller/{vendingMachineId}")
    public ResponseEntity<VendingMachineSellerResponse> findVendingMachineForSeller(
            @AuthUser User user,
            @PathVariable(name = "vendingMachineId") Long vendingMachineId
    ) {
        return ResponseEntity.ok(vendingMachineService.findVendingMachineForSeller(user, vendingMachineId));
    }

}
