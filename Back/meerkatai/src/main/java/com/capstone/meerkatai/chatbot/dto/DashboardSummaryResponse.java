package com.capstone.meerkatai.chatbot.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

/**
 * 대시보드 요약 정보 응답을 담는 DTO 클래스
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {
    
    /**
     * 요약 날짜
     */
    private LocalDate summaryDate;
    
    /**
     * 총 이상 행동 건수
     */
    private Integer totalAnomalies;
    
    /**
     * 유형별 이상 행동 통계
     */
    private Map<String, Integer> anomalyTypeCounts;
    
    /**
     * 활성 CCTV 개수
     */
    private Integer activeCctvCount;
    
    /**
     * 총 CCTV 개수
     */
    private Integer totalCctvCount;
    
    /**
     * 저장 공간 사용률
     */
    private Double storageUsagePercentage;
    
    /**
     * 시스템 상태
     */
    private String systemStatus;
    
    /**
     * 주요 알림 사항
     */
    private String mainAlert;
    
    /**
     * 요약 메시지
     */
    private String summaryMessage;
}