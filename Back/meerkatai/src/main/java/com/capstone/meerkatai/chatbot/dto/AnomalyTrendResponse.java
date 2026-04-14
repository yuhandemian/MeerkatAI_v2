package com.capstone.meerkatai.chatbot.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 이상 행동 트렌드 분석 결과를 담는 DTO 클래스
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnomalyTrendResponse {
    
    /**
     * 분석 기간
     */
    private String analysisPeriod;
    
    /**
     * 총 이상 행동 건수
     */
    private Long totalCount;
    
    /**
     * 유형별 통계
     */
    private Map<String, Long> typeStatistics;
    
    /**
     * 시간대별 통계 (24시간)
     */
    private Map<Integer, Long> hourlyStatistics;
    
    /**
     * 요일별 통계
     */
    private Map<String, Long> dailyStatistics;
    
    /**
     * CCTV별 통계
     */
    private Map<String, Long> cctvStatistics;
    
    /**
     * 트렌드 분석 결과
     */
    private String trendAnalysis;
    
    /**
     * 주요 인사이트
     */
    private List<String> keyInsights;
    
    /**
     * 위험도 평가
     */
    private String riskLevel;
    
    /**
     * 권장사항
     */
    private List<String> recommendations;
}