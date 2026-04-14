package com.capstone.meerkatai.storagespace.service;

import com.capstone.meerkatai.alarm.dto.AnomalyVideoMetadataRequest;
import com.capstone.meerkatai.global.service.S3Service;
import com.capstone.meerkatai.storagespace.entity.StorageSpace;
import com.capstone.meerkatai.storagespace.repository.StorageSpaceRepository;
import com.capstone.meerkatai.user.entity.User;
import com.capstone.meerkatai.user.repository.UserRepository;
import com.capstone.meerkatai.chatbot.dto.StorageInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageSpaceService {

    private final UserRepository userRepository;

    private final StorageSpaceRepository storageSpaceRepository;
    private final S3Service s3Service;

    public void updateUsedSpace(AnomalyVideoMetadataRequest request) {
        Long userId = request.getUserId();

        // 1. 사용자에 해당하는 저장공간 엔티티 조회
        StorageSpace storageSpace = storageSpaceRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    // 생성 로직: 기본 총 용량 10GB, 사용량 0
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + userId));
                    StorageSpace newSpace = StorageSpace.builder()
                            .user(user)
                            .totalSpace(10L * 1024 * 1024 * 1024)
                            .usedSpace(0L)
                            .build();
                    try {
                        return storageSpaceRepository.save(newSpace);
                    } catch (Exception e) {
                        log.warn("저장공간 생성 실패. 동시성 가능성 고려: {}", e.getMessage());
                        return storageSpaceRepository.findByUserUserId(userId)
                                .orElseThrow(() -> new RuntimeException("저장공간 정보 생성 실패"));
                    }
                });

        // 2. 영상 URL로부터 파일 사이즈 추출
        long fileSizeInBytes = getS3FileSize(request.getVideoUrl());

        // 3. 기존 used_space에 더해서 갱신
        long currentUsed = storageSpace.getUsedSpace() != null ? storageSpace.getUsedSpace() : 0;
        storageSpace.setUsedSpace(currentUsed + fileSizeInBytes);

        // 4. 저장
        storageSpaceRepository.save(storageSpace);
        log.info("✅ 저장공간 갱신 완료: user={}, 추가 사용량={} byte", userId, fileSizeInBytes);
    }

    private long getS3FileSize(String fileUrl) {
        try {
            if (!s3Service.isS3Url(fileUrl)) {
                log.warn("S3 URL이 아닙니다: {}", fileUrl);
                return 0;
            }
            
            // 1. 객체 키 추출
            String objectKey = s3Service.extractS3Key(fileUrl);
            if (objectKey == null) {
                log.warn("S3 객체 키를 추출할 수 없습니다: {}", fileUrl);
                return 0;
            }
            
            // 2. S3 메타데이터 API로 파일 크기 가져오기
            long size = s3Service.getObjectSize(objectKey);
            if (size > 0) {
                log.info("S3 메타데이터에서 파일 크기 조회 성공: {} 바이트", size);
                return size;
            }
            
            // 3. 메타데이터로 조회 실패한 경우 Presigned URL로 시도
            log.info("메타데이터 조회 실패. Presigned URL로 파일 크기 조회 시도");
            URL presignedUrl = s3Service.generatePresignedUrlForDownload(objectKey);
            
            try {
                HttpURLConnection conn = (HttpURLConnection) presignedUrl.openConnection();
                conn.setRequestMethod("HEAD");
                long contentLength = conn.getContentLengthLong();
                if (contentLength > 0) {
                    log.info("Presigned URL로 파일 크기 조회 성공: {} 바이트", contentLength);
                    return contentLength;
                } else {
                    log.warn("Presigned URL로도 파일 크기를 가져올 수 없습니다.");
                }
            } catch (Exception e) {
                log.warn("Presigned URL로 파일 크기 조회 실패: {}", e.getMessage());
            }
            
            // 기본값: 평균 영상 크기 (5MB)
            long defaultSize = 5 * 1024 * 1024;
            log.info("파일 크기를 확인할 수 없어 기본값 사용: {} 바이트", defaultSize);
            return defaultSize;
        } catch (Exception e) {
            log.warn("⚠️ 파일 사이즈 확인 실패: {}", e.getMessage());
            // 기본값: 평균 영상 크기 (5MB)
            return 5 * 1024 * 1024;
        }
    }

    //로그인시 생성되는 저장공간 테이블 생성 메소드
    public void saveStorageSpace(User user) {

        Long totalSpace = 100L;
        Long usedSpace = 0L;

        StorageSpace storageSpace = StorageSpace.builder()
                .totalSpace(totalSpace)
                .usedSpace(usedSpace)
                .user(user)
                .build();

        // 4. 저장
        storageSpaceRepository.save(storageSpace);

        log.info("✅ 이상행동 저장 완료: anomaly_id={}", storageSpace.getStorageId());
    }
    
    /**
     * 사용자의 저장 공간 정보를 조회합니다 (챗봇용)
     * @param userId 사용자 ID
     * @return 저장 공간 정보 응답
     */
    public StorageInfoResponse getStorageInfoForChatbot(Long userId) {
        log.info("챗봇용 저장 공간 정보 조회: userId={}", userId);
        
        StorageSpace storageSpace = storageSpaceRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("저장공간 정보를 찾을 수 없습니다: userId=" + userId));
        
        Long totalSpace = storageSpace.getTotalSpace();
        Long usedSpace = storageSpace.getUsedSpace() != null ? storageSpace.getUsedSpace() : 0L;
        Long availableSpace = totalSpace - usedSpace;
        
        double usagePercentage = totalSpace > 0 ? (double) usedSpace / totalSpace * 100 : 0.0;
        
        String usageStatus;
        String warningMessage;
        
        if (usagePercentage >= 90) {
            usageStatus = "위험";
            warningMessage = "저장 공간이 90% 이상 사용되어 즉시 정리가 필요합니다!";
        } else if (usagePercentage >= 80) {
            usageStatus = "높음";
            warningMessage = "저장 공간이 80% 이상 사용되어 정리를 권장합니다.";
        } else if (usagePercentage >= 60) {
            usageStatus = "보통";
            warningMessage = "저장 공간 사용량이 보통 수준입니다.";
        } else {
            usageStatus = "낮음";
            warningMessage = "저장 공간이 충분합니다.";
        }
        
        return StorageInfoResponse.builder()
                .totalSpace(totalSpace)
                .usedSpace(usedSpace)
                .availableSpace(availableSpace)
                .usagePercentage(usagePercentage)
                .usageStatus(usageStatus)
                .warningMessage(warningMessage)
                .build();
    }
}