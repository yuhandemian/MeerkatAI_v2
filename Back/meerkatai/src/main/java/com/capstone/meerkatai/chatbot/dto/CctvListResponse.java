package com.capstone.meerkatai.chatbot.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * CCTV 목록 응답을 담는 DTO 클래스
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CctvListResponse {
    
    /**
     * 총 CCTV 개수
     */
    private int totalCount;
    
    /**
     * CCTV 목록
     */
    private List<CctvInfo> cctvList;
    
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CctvInfo {
        private Long cctvId;
        private String cctvName;
        private String ipAddress;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime lastActivity;
    }
}