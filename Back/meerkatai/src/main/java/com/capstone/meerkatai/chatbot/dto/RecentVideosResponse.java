package com.capstone.meerkatai.chatbot.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 최근 영상 목록 응답을 담는 DTO 클래스
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentVideosResponse {
    
    /**
     * 총 영상 개수
     */
    private int totalCount;
    
    /**
     * 영상 목록
     */
    private List<VideoInfo> videoList;
    
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VideoInfo {
        private Long videoId;
        private String cctvName;
        private LocalDateTime anomalyTime;
        private Long duration;
        private Long fileSize;
        private String status;
        private String downloadUrl;
        private String thumbnailUrl;
    }
}