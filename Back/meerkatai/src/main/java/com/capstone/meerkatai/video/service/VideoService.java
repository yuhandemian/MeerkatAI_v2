package com.capstone.meerkatai.video.service;

import com.capstone.meerkatai.chatbot.dto.RecentVideosResponse;
import com.capstone.meerkatai.video.entity.Video;
import com.capstone.meerkatai.video.repository.VideoRepository;
import com.capstone.meerkatai.video.dto.GetVideoListResponse;
import com.capstone.meerkatai.video.dto.VideoListRequest;
import com.capstone.meerkatai.video.dto.VideoDetailsResponse;
import com.capstone.meerkatai.alarm.dto.AnomalyVideoMetadataRequest;
import com.capstone.meerkatai.anomalybehavior.entity.AnomalyBehavior;
import com.capstone.meerkatai.global.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.AbstractMap;
import java.util.stream.Stream;

/**
 * 비디오 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final S3Service s3Service;

    /**
     * 사용자의 최근 영상 목록을 조회합니다 (챗봇용)
     * @param userId 사용자 ID
     * @param startDate 시작 날짜 (null이면 최근 7일)
     * @param endDate 종료 날짜 (null이면 현재)
     * @param limit 조회 개수 제한 (기본 10개)
     * @return 최근 영상 목록 응답
     */
    public RecentVideosResponse getRecentVideosForChatbot(Long userId, LocalDateTime startDate, LocalDateTime endDate, int limit) {
        log.info("챗봇용 최근 영상 조회: userId={}, startDate={}, endDate={}, limit={}", userId, startDate, endDate, limit);
        
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }
        if (startDate == null) {
            startDate = endDate.minusDays(7);
        }
        
        // createdAt 필드가 없으므로 모든 비디오를 조회한 후 필터링
        final LocalDateTime finalStartDate = startDate;
        final LocalDateTime finalEndDate = endDate;
        
        List<Video> allVideos = videoRepository.findByUserUserId(userId);
        List<Video> videos = allVideos.stream()
                .filter(video -> {
                    if (video.getAnomalyBehavior() != null && video.getAnomalyBehavior().getAnomalyTime() != null) {
                        LocalDateTime anomalyTime = video.getAnomalyBehavior().getAnomalyTime();
                        return !anomalyTime.isBefore(finalStartDate) && !anomalyTime.isAfter(finalEndDate);
                    }
                    return false;
                })
                .sorted((v1, v2) -> {
                    LocalDateTime time1 = v1.getAnomalyBehavior() != null ? v1.getAnomalyBehavior().getAnomalyTime() : LocalDateTime.MIN;
                    LocalDateTime time2 = v2.getAnomalyBehavior() != null ? v2.getAnomalyBehavior().getAnomalyTime() : LocalDateTime.MIN;
                    return time2.compareTo(time1); // 최신순 정렬
                })
                .collect(Collectors.toList());
        
        // 제한 개수만큼만 가져오기
        if (videos.size() > limit) {
            videos = videos.subList(0, limit);
        }
        
        List<RecentVideosResponse.VideoInfo> videoInfoList = videos.stream()
                .map(video -> {
                    String cctvName = "알 수 없음";
                    if (video.getStreamingVideo() != null && video.getStreamingVideo().getCctv() != null) {
                        cctvName = video.getStreamingVideo().getCctv().getCctvName();
                    }
                    
                    // S3 URL을 presigned URL로 변환
                    String downloadUrl = generatePresignedUrlIfNeeded(video.getFilePath());
                    String thumbnailUrl = generatePresignedUrlIfNeeded(video.getThumbnailPath());
                    
                    return RecentVideosResponse.VideoInfo.builder()
                            .videoId(video.getVideoId())
                            .cctvName(cctvName)
                            .anomalyTime(video.getAnomalyBehavior() != null ? video.getAnomalyBehavior().getAnomalyTime() : LocalDateTime.now())
                            .duration(video.getDuration())
                            .fileSize(video.getFileSize())
                            .status(video.getVideoStatus() ? "정상" : "오류")
                            .downloadUrl(downloadUrl)
                            .thumbnailUrl(thumbnailUrl)
                            .build();
                })
                .collect(Collectors.toList());
        
        return RecentVideosResponse.builder()
                .totalCount(videoInfoList.size())
                .videoList(videoInfoList)
                .build();
    }
    
    /**
     * 특정 비디오의 상세 정보를 조회합니다 (챗봇용)
     * @param videoId 비디오 ID
     * @param userId 사용자 ID
     * @return 비디오 상세 정보
     */
    public String getVideoDetailsForChatbot(Long videoId, Long userId) {
        log.info("챗봇용 비디오 상세 조회: videoId={}, userId={}", videoId, userId);
        
        Video video = videoRepository.findByVideoIdAndUserUserId(videoId, userId)
                .orElseThrow(() -> new RuntimeException("비디오를 찾을 수 없습니다: ID=" + videoId));
        
        String cctvName = "알 수 없음";
        if (video.getStreamingVideo() != null && video.getStreamingVideo().getCctv() != null) {
            cctvName = video.getStreamingVideo().getCctv().getCctvName();
        }
        
        String downloadUrl = generatePresignedUrlIfNeeded(video.getFilePath());
        String thumbnailUrl = generatePresignedUrlIfNeeded(video.getThumbnailPath());
        
        return String.format(
                "📹 비디오 상세 정보\n\n" +
                "• 비디오 ID: %d\n" +
                "• CCTV: %s\n" +
                "• 생성일: %s\n" +
                "• 재생 시간: %d초\n" +
                "• 파일 크기: %.2f MB\n" +
                "• 상태: %s\n" +
                "• 다운로드 URL: %s\n" +
                "• 썸네일 URL: %s",
                video.getVideoId(),
                cctvName,
                video.getAnomalyBehavior() != null && video.getAnomalyBehavior().getAnomalyTime() != null ? 
                    video.getAnomalyBehavior().getAnomalyTime().toString() : "정보 없음",
                video.getDuration(),
                video.getFileSize() / (1024.0 * 1024.0),
                video.getVideoStatus() ? "정상" : "오류",
                downloadUrl,
                thumbnailUrl
        );
    }
    
    /**
     * S3 URL인 경우 Presigned URL로 변환, 아닌 경우 원래 URL 반환
     */
    private String generatePresignedUrlIfNeeded(String url) {
        if (url == null || url.isEmpty()) {
            return url;
        }
        
        try {
            if (s3Service.isS3Url(url)) {
                String objectKey = s3Service.extractS3Key(url);
                if (objectKey != null) {
                    return s3Service.generatePresignedUrlForDownload(objectKey).toString();
                }
            }
        } catch (Exception e) {
            log.warn("Presigned URL 생성 실패, 원본 URL 사용: {}", e.getMessage());
        }
        
        return url;
    }
    
    /**
     * 사용자의 비디오 목록을 필터 기반으로 조회합니다
     * @param userId 사용자 ID
     * @param request 필터 요청
     * @return 비디오 목록 응답
     */
    public GetVideoListResponse getVideosByFilters(Long userId, VideoListRequest request) {
        log.info("필터 기반 비디오 조회: userId={}, request={}", userId, request);
        
        // 기본 집합: 최신순 전체
        List<Video> allVideos = videoRepository.findByUserUserIdOrderByAnomalyBehavior_AnomalyTimeDesc(userId);
        Stream<Video> stream = allVideos.stream();
        
        // 날짜 필터
        if (request.getStart_date() != null && !request.getStart_date().isBlank() &&
            request.getEnd_date() != null && !request.getEnd_date().isBlank()) {
            // 날짜 형식은 컨트롤러에서 이미 검증되어 있다고 가정
            // 프런트의 포맷: yyyy-MM-dd
            java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
            java.time.LocalDate start = java.time.LocalDate.parse(request.getStart_date(), fmt);
            java.time.LocalDate end = java.time.LocalDate.parse(request.getEnd_date(), fmt);
            stream = stream.filter(v -> v.getAnomalyBehavior() != null && v.getAnomalyBehavior().getAnomalyTime() != null)
                           .filter(v -> {
                               java.time.LocalDate d = v.getAnomalyBehavior().getAnomalyTime().toLocalDate();
                               return !d.isBefore(start) && !d.isAfter(end);
                           });
        }
        
        // 유형 필터 (type1~type7 -> 한글명 포함 문자열 매칭)
        if (request.getAnomaly_behavior_type() != null && !request.getAnomaly_behavior_type().isBlank()) {
            String typeKey = request.getAnomaly_behavior_type().toLowerCase();
            java.util.Map<String, String> keywordMap = java.util.Map.of(
                "type1", "전도",
                "type2", "파손",
                "type3", "방화",
                "type4", "흡연",
                "type5", "유기",
                "type6", "절도",
                "type7", "폭행"
            );
            String keyword = keywordMap.get(typeKey);
            if (keyword != null) {
                stream = stream.filter(v -> v.getAnomalyBehavior() != null && v.getAnomalyBehavior().getAnomalyBehaviorType() != null)
                               .filter(v -> v.getAnomalyBehavior().getAnomalyBehaviorType().contains(keyword));
            }
        }
        
        List<Video> filtered = stream.collect(Collectors.toList());
        
        int page = (request.getPage() == null || request.getPage() < 1) ? 1 : request.getPage();
        final int limit = 6;
        int total = filtered.size();
        int pages = (int) Math.ceil((double) total / limit);
        int offset = (page - 1) * limit;
        
        List<Video> paged = filtered.stream().skip(offset).limit(limit).collect(Collectors.toList());
        
        List<GetVideoListResponse.VideoDto> videoDtos = paged.stream()
            .map(video -> {
                String videoPath = generatePresignedUrlIfNeeded(video.getFilePath());
                String thumbnailPath = generatePresignedUrlIfNeeded(video.getThumbnailPath());
                return new GetVideoListResponse.VideoDto(
                    video.getVideoId(),
                    videoPath,
                    thumbnailPath,
                    video.getDuration(),
                    video.getFileSize(),
                    video.getVideoStatus(),
                    video.getAnomalyBehavior() != null ? video.getAnomalyBehavior().getAnomalyTime().toString() : null,
                    video.getStreamingVideo() != null ? video.getStreamingVideo().getStreamingVideoId() : null,
                    video.getAnomalyBehavior() != null ? video.getAnomalyBehavior().getAnomalyBehaviorType() : null,
                    (video.getStreamingVideo() != null && video.getStreamingVideo().getCctv() != null) ? video.getStreamingVideo().getCctv().getCctvName() : "알 수 없음"
                );
            })
            .collect(Collectors.toList());
        
        GetVideoListResponse.Pagination pagination = new GetVideoListResponse.Pagination(total, page, pages, limit);
        return new GetVideoListResponse("success", new GetVideoListResponse.Data(videoDtos, pagination));
    }
    
    /**
     * 사용자의 비디오 목록을 페이지네이션으로 조회합니다
     * @param userId 사용자 ID
     * @param page 페이지 번호
     * @return 비디오 목록 응답
     */
    public GetVideoListResponse getVideosByUser(Long userId, int page) {
        log.info("사용자 비디오 목록 조회: userId={}, page={}", userId, page);
        
        final int limit = 6;
        int safePage = page < 1 ? 1 : page;
        int offset = (safePage - 1) * limit;
        
        // 최신순 정렬: 이상행동 시간 기준 내림차순
        List<Video> allVideos = videoRepository.findByUserUserIdOrderByAnomalyBehavior_AnomalyTimeDesc(userId);
        int total = allVideos.size();
        int pages = (int) Math.ceil((double) total / limit);
        
        List<Video> pagedVideos = allVideos.stream()
            .skip(offset)
            .limit(limit)
            .collect(Collectors.toList());
        
        List<GetVideoListResponse.VideoDto> videoDtos = pagedVideos.stream()
            .map(video -> {
                String videoPath = generatePresignedUrlIfNeeded(video.getFilePath());
                String thumbnailPath = generatePresignedUrlIfNeeded(video.getThumbnailPath());
                return new GetVideoListResponse.VideoDto(
                        video.getVideoId(),
                        videoPath,
                        thumbnailPath,
                        video.getDuration(),
                        video.getFileSize(),
                        video.getVideoStatus(),
                        video.getAnomalyBehavior() != null && video.getAnomalyBehavior().getAnomalyTime() != null ?
                                video.getAnomalyBehavior().getAnomalyTime().toString() : null,
                        video.getStreamingVideo() != null ? video.getStreamingVideo().getStreamingVideoId() : null,
                        video.getAnomalyBehavior() != null ? video.getAnomalyBehavior().getAnomalyBehaviorType() : null,
                        (video.getStreamingVideo() != null && video.getStreamingVideo().getCctv() != null) ? video.getStreamingVideo().getCctv().getCctvName() : "알 수 없음"
                );
            })
            .collect(Collectors.toList());
        
        GetVideoListResponse.Pagination pagination = new GetVideoListResponse.Pagination(total, safePage, pages, limit);
        GetVideoListResponse.Data data = new GetVideoListResponse.Data(videoDtos, pagination);
        return new GetVideoListResponse("success", data);
    }
    
    /**
     * 비디오 스트림을 조회합니다
     * @param userId 사용자 ID
     * @param videoIds 비디오 ID 목록
     * @return 비디오 스트림 목록
     */
    public List<AbstractMap.SimpleEntry<String, InputStream>> getVideoStreams(Long userId, List<Long> videoIds) {
        log.info("비디오 스트림 조회: userId={}, videoIds={}", userId, videoIds);
        
        List<AbstractMap.SimpleEntry<String, InputStream>> streams = new ArrayList<>();
        
        for (Long videoId : videoIds) {
            Video video = videoRepository.findByVideoIdAndUserUserId(videoId, userId)
                    .orElse(null);
            
            if (video != null) {
                try {
                    // S3에서 스트림 생성
                    String objectKey = s3Service.extractS3Key(video.getFilePath());
                    InputStream stream = s3Service.getObjectStream(objectKey);
                    streams.add(new AbstractMap.SimpleEntry<>(video.getFilePath(), stream));
                } catch (Exception e) {
                    log.error("비디오 스트림 생성 실패: videoId={}", videoId, e);
                }
            }
        }
        
        return streams;
    }
    
    /**
     * 사용자의 비디오들을 삭제합니다
     * @param userId 사용자 ID
     * @param videoIds 삭제할 비디오 ID 목록
     * @return 삭제된 비디오 ID 목록
     */
    public List<Long> deleteVideosByUser(Long userId, List<Long> videoIds) {
        log.info("사용자 비디오 삭제: userId={}, videoIds={}", userId, videoIds);
        
        List<Long> deletedIds = new ArrayList<>();
        
        for (Long videoId : videoIds) {
            try {
                Video video = videoRepository.findByVideoIdAndUserUserId(videoId, userId)
                        .orElse(null);
                
                if (video != null) {
                    // S3에서 파일 삭제
                    try {
                        String objectKey = s3Service.extractS3Key(video.getFilePath());
                        s3Service.deleteObject(objectKey);
                    } catch (Exception e) {
                        log.warn("S3 파일 삭제 실패: {}", video.getFilePath(), e);
                    }
                    
                    // 데이터베이스에서 삭제
                    videoRepository.delete(video);
                    deletedIds.add(videoId);
                }
            } catch (Exception e) {
                log.error("비디오 삭제 실패: videoId={}", videoId, e);
            }
        }
        
        return deletedIds;
    }
    
    /**
     * 비디오 상세 정보를 조회합니다
     * @param userId 사용자 ID
     * @param videoId 비디오 ID
     * @return 비디오 상세 정보
     */
    public VideoDetailsResponse getVideoDetails(Long userId, Long videoId) {
        log.info("비디오 상세 정보 조회: userId={}, videoId={}", userId, videoId);
        
        Video video = videoRepository.findByVideoIdAndUserUserId(videoId, userId)
                .orElseThrow(() -> new RuntimeException("비디오를 찾을 수 없습니다: ID=" + videoId));
        
        String videoPath = generatePresignedUrlIfNeeded(video.getFilePath());
        String thumbnailPath = generatePresignedUrlIfNeeded(video.getThumbnailPath());
        
        String cctvName = "알 수 없음";
        Long cctvId = null;
        String anomalyType = null;
        
        if (video.getStreamingVideo() != null && video.getStreamingVideo().getCctv() != null) {
            cctvName = video.getStreamingVideo().getCctv().getCctvName();
            cctvId = video.getStreamingVideo().getCctv().getCctvId();
        }
        
        if (video.getAnomalyBehavior() != null) {
            anomalyType = video.getAnomalyBehavior().getAnomalyBehaviorType();
        }
        
        return new VideoDetailsResponse(
                video.getVideoId(),
                videoPath,
                thumbnailPath,
                video.getDuration(),
                video.getFileSize(),
                video.getVideoStatus(),
                video.getAnomalyBehavior() != null && video.getAnomalyBehavior().getAnomalyTime() != null ? 
                    video.getAnomalyBehavior().getAnomalyTime().toString() : null,
                video.getStreamingVideo() != null ? video.getStreamingVideo().getStreamingVideoId() : null,
                cctvId,
                cctvName,
                userId,
                anomalyType
        );
    }
    
    /**
     * 이상 행동 비디오를 저장합니다
     * @param request 이상 행동 비디오 메타데이터 요청
     * @param anomalyBehavior 저장된 이상 행동 엔티티
     * @return 저장된 비디오 엔티티
     */
    @Transactional
    public Video saveVideo(AnomalyVideoMetadataRequest request, AnomalyBehavior anomalyBehavior) {
        log.info("이상 행동 비디오 저장: request={}, anomalyBehaviorId={}", request, anomalyBehavior.getAnomalyId());
        
        try {
            // 비디오 엔티티 생성 (필수 필드만 설정)
            Video video = new Video();
            video.setFilePath(request.getVideoUrl());
            video.setThumbnailPath(request.getThumbnailUrl());
            video.setVideoStatus(true); // 기본값: 활성
            video.setUser(anomalyBehavior.getUser());
            video.setStreamingVideo(anomalyBehavior.getStreamingVideo());
            video.setAnomalyBehavior(anomalyBehavior);
            
            // duration과 fileSize는 기본값으로 설정 (나중에 별도로 업데이트 가능)
            video.setDuration(0L); // 기본값
            video.setFileSize(0L); // 기본값
            
            // 비디오 저장
            Video savedVideo = videoRepository.save(video);
            
            log.info("비디오 저장 완료: videoId={}", savedVideo.getVideoId());
            return savedVideo;
            
        } catch (Exception e) {
            log.error("비디오 저장 실패: request={}", request, e);
            throw new RuntimeException("비디오 저장 중 오류가 발생했습니다.", e);
        }
    }
}