package com.breadbolletguys.breadbread.image.application;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class IpfsService {
    @Value("${ipfs.w3.cmd.path}")
    private String path;

    public String uploadFile(MultipartFile file) {
        try {
            File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile);
            log.info("{}", file);
            String w3Path = new File(path).getAbsolutePath();
            ProcessBuilder pb = new ProcessBuilder(w3Path, "up", tempFile.getAbsolutePath());
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            String ipfsUrl = null;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("⁂ https://")) {
                    ipfsUrl = line.replace("⁂ ", "").trim();
                }
            }
            log.info("IPFS URL : {}", ipfsUrl);
            process.waitFor();
            tempFile.delete();

            if (ipfsUrl == null) {
                throw new RuntimeException("IPFS 업로드 실패: URL이 null입니다.");
            }
            String fullUrl = ipfsUrl + "/" + tempFile.getName();

            return fullUrl;

        } catch (Exception e) {
            throw new RuntimeException("IPFS 업로드 중 오류 발생: " + e.getMessage(), e);
        }
    }
}


