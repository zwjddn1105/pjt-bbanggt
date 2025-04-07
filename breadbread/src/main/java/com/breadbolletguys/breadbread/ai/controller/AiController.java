package com.breadbolletguys.breadbread.ai.controller;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import java.io.IOException;

import com.breadbolletguys.breadbread.ai.controller.response.BadBreadResponse;
import com.breadbolletguys.breadbread.ai.controller.response.BreadClassificationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.ai.service.AiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {
    private final AiService aiService;

    @PostMapping(consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BreadClassificationResponse> getObjects(
        @RequestParam MultipartFile multipartFile
    ) throws IOException {
        return ResponseEntity.ok(aiService.aiClient(multipartFile));
    }

    @PostMapping(path = "/2", consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BadBreadResponse> badObjects(
        @RequestParam MultipartFile multipartFile
    ) throws IOException {
        return ResponseEntity.ok(aiService.aiClient2(multipartFile));
    }
}
