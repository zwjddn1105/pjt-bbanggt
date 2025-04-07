package com.breadbolletguys.breadbread.ai.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import com.breadbolletguys.breadbread.ai.controller.response.BadBreadResponse;
import com.breadbolletguys.breadbread.ai.controller.response.BreadClassificationResponse;

import lombok.NoArgsConstructor;

@Service
@NoArgsConstructor
public class AiService {

    @Value("${ai.server.ip}")
    private String serverIp;

    @Value("${ai.server.port}")
    private String serverPort;

    @Value("${ai.server.port2}")
    private String serverPort2;

    public BreadClassificationResponse aiClient(MultipartFile file) throws IOException {
        RestClient restClient = RestClient.create();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        body.add("file", resource);

        return restClient.post()
                .uri("https://" + serverIp + ":" + serverPort + "/predict2")
                .contentType(MediaType.MULTIPART_FORM_DATA)  // multipart/form-data로 전송
                .body(body)
                .retrieve()
                .body(BreadClassificationResponse.class);
    }

    public BadBreadResponse aiClient2(MultipartFile file) throws IOException {
        RestClient restClient = RestClient.create();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        body.add("file", resource);

        return restClient.post()
                .uri("https://" + serverIp + ":" + serverPort2 + "/predict2")
                .contentType(MediaType.MULTIPART_FORM_DATA)  // multipart/form-data로 전송
                .body(body)
                .retrieve()
                .body(BadBreadResponse.class);
    }


}

