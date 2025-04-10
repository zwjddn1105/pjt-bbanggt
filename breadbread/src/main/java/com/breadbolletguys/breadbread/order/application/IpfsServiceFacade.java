package com.breadbolletguys.breadbread.order.application;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.image.application.IpfsService;
import com.breadbolletguys.breadbread.image.domain.NftImage;
import com.breadbolletguys.breadbread.image.domain.repository.NftImageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IpfsServiceFacade {
    private final IpfsService ipfsService;
    private final NftImageRepository nftImageRepository;

    @Async("ipfsExecutor")
    public void uploadImage(Long orderId, MultipartFile image) {
        String resultUrl = ipfsService.uploadFile(image);
        nftImageRepository.save(
                NftImage.builder()
                        .orderId(orderId)
                        .image(resultUrl)
                        .build()
        );
        // Image를 분산 원장에 저장한다.
        // 테이블 따로 빼놓은 거에서 이렇게 호출하면 저장이 돼요! 그리고 따로 이거 응답을 void로 두면 안받음.
        // NFTService.saveImage(ddlkdlqk)
        // image 를 분산 원장에서 URL을 가져온다. ->
        // NFT 거기서 가져오는 거잖아?
    }
}
