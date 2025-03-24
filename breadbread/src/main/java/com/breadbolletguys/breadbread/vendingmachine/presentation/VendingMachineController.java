package com.breadbolletguys.breadbread.vendingmachine.presentation;

import java.net.URI;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.auth.annotation.AdminUser;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.vendingmachine.application.VendingMachineService;
import com.breadbolletguys.breadbread.vendingmachine.domain.dto.request.VendingMachineCreateJsonRequest;

import lombok.RequiredArgsConstructor;

/**
 * Admin API
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/vending-machines")
public class VendingMachineController {

    private final VendingMachineService vendingMachineService;

    /**
     * 자판기 정보를 입력받고 저장한다.
     */
    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Void> create(
            @AdminUser User user,
            @RequestPart VendingMachineCreateJsonRequest jsonRequest,
            @RequestPart List<MultipartFile> files
    ) {
        // TODO: 파일을 S3에 업로드하고 url을 받아온다.
        List<String> imageUrls = List.of("tmpImage1.jpg", "tmpImage2.png");
        Long vendingMachineId = vendingMachineService.save(jsonRequest, imageUrls);
        return ResponseEntity.created(URI.create("/api/v1/vending-machines/" + vendingMachineId)).build();
    }

    @DeleteMapping("/{vendingMachineId}")
    public ResponseEntity<Void> delete(
            @AdminUser User user,
            @PathVariable(name = "vendingMachineId") Long vendingMachineId
    ) {
        vendingMachineService.delete(vendingMachineId);
        return ResponseEntity.noContent().build();
    }
}
