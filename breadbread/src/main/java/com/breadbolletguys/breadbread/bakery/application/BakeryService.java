package com.breadbolletguys.breadbread.bakery.application;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.breadbolletguys.breadbread.bakery.domain.Bakery;
import com.breadbolletguys.breadbread.bakery.domain.dto.request.BakeryRequest;
import com.breadbolletguys.breadbread.bakery.domain.dto.response.BakeryResponse;
import com.breadbolletguys.breadbread.bakery.domain.repository.BakeryRepository;
import com.breadbolletguys.breadbread.common.exception.BadRequestException;
import com.breadbolletguys.breadbread.common.exception.ErrorCode;
import com.breadbolletguys.breadbread.common.exception.NotFoundException;
import com.breadbolletguys.breadbread.user.domain.Bookmark;
import com.breadbolletguys.breadbread.user.domain.User;
import com.breadbolletguys.breadbread.user.domain.repository.BookmarkRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class BakeryService {
    private final BakeryRepository bakeryRepository;
    private final BookmarkRepository bookmarkRepository;

    @Transactional
    public void save(User user, BakeryRequest bakeryRequest) {
        Bakery bakery = Bakery.builder()
                .userId(user.getId())
                .name(bakeryRequest.getName())
                .businessNumber(bakeryRequest.getBusinessNumber())
                .address(bakeryRequest.getAddress())
                .authenticationDate(LocalDateTime.now())
                .authenticated(true)
                .build();
        bakeryRepository.save(bakery);
        user.changeSeller();
    }

    @Transactional(readOnly = true)
    public BakeryResponse findByBakeryId(User user, Long bakeryId) {
        BakeryResponse response = bakeryRepository.findBakeryBaseInfo(bakeryId);
        boolean isMark = bookmarkRepository.existsByUserIdAndBakeryId(user.getId(), bakeryId);
        response.updateMark(isMark);
        return response;
    }

    @Transactional
    public void updateBakery(User user, Long bakeryId, BakeryRequest bakeryRequest) {
        Bakery bakery = bakeryRepository.findById(bakeryId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.BAKERY_NOT_FOUND));

        if (!user.getId().equals(bakery.getUserId())) {
            throw new BadRequestException(ErrorCode.UNAUTHORIZED_ACCESS);
        }
        bakery.update(
                bakeryRequest.getName(),
                bakeryRequest.getBusinessNumber(),
                bakeryRequest.getAddress()
        );
    }

    @Transactional
    public void addBookmark(User user, Long bakeryId) {
        if (bookmarkRepository.existsByUserIdAndBakeryId(user.getId(), bakeryId)) {
            throw new BadRequestException(ErrorCode.DUPLICATE_BOOKMARK);
        }
        Bookmark bookmark = Bookmark.builder()
                .userId(user.getId())
                .bakeryId(bakeryId)
                .build();
        bookmarkRepository.save(bookmark);
    }

    @Transactional
    public void removeBookmark(User user, Long bakeryId) {
        if (!bookmarkRepository.existsByUserIdAndBakeryId(user.getId(), bakeryId)) {
            throw new NotFoundException(ErrorCode.BOOKMARK_NOT_FOUND);
        }
        bookmarkRepository.deleteByUserIdAndBakeryId(user.getId(), bakeryId);
    }

    @Transactional(readOnly = true)
    public List<BakeryResponse> getBookMarkBakery(User user) {
        List<Long> bakeryIds = bookmarkRepository.findBakeryIdsByUserId(user.getId());
        return bakeryRepository.findBakeryBaseInfos(bakeryIds);
    }
}