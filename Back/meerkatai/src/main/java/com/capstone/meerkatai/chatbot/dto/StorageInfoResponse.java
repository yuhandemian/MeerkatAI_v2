package com.capstone.meerkatai.chatbot.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * 저장 공간 정보 응답을 담는 DTO 클래스
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StorageInfoResponse {
    
    /**
     * 총 저장 공간 (바이트)
     */
    private Long totalSpace;
    
    /**
     * 사용된 저장 공간 (바이트)
     */
    private Long usedSpace;
    
    /**
     * 사용 가능한 저장 공간 (바이트)
     */
    private Long availableSpace;
    
    /**
     * 사용률 (퍼센트)
     */
    private Double usagePercentage;
    
    /**
     * 사용률 상태 (낮음/보통/높음/위험)
     */
    private String usageStatus;
    
    /**
     * 사용률에 따른 경고 메시지
     */
    private String warningMessage;
}