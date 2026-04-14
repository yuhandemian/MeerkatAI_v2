package com.capstone.meerkatai.dashboard.service;

import com.capstone.meerkatai.chatbot.dto.DashboardSummaryResponse;
import com.capstone.meerkatai.dashboard.entity.Dashboard;
import com.capstone.meerkatai.dashboard.repository.DashboardRepository;
import com.capstone.meerkatai.cctv.repository.CctvRepository;
import com.capstone.meerkatai.storagespace.repository.StorageSpaceRepository;
import com.capstone.meerkatai.anomalybehavior.repository.AnomalyBehaviorRepository;
import com.capstone.meerkatai.alarm.dto.AnomalyVideoMetadataRequest;
import com.capstone.meerkatai.user.entity.User;
import com.capstone.meerkatai.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.time.YearMonth;

/**
 * 대시보드 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final CctvRepository cctvRepository;
    private final StorageSpaceRepository storageSpaceRepository;
    private final AnomalyBehaviorRepository anomalyBehaviorRepository;
    private final UserRepository userRepository;

    /**
     * 사용자의 대시보드 요약 정보를 조회합니다 (챗봇용)
     * @param userId 사용자 ID
     * @param date 조회 날짜 (null이면 오늘)
     * @return 대시보드 요약 응답
     */
    public DashboardSummaryResponse getDashboardSummaryForChatbot(Long userId, LocalDate date) {
        log.info("챗봇용 대시보드 요약 조회: userId={}, date={}", userId, date);
        
        if (date == null) {
            date = LocalDate.now();
        }
        
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        // 오늘의 이상 행동 통계
        Long totalAnomalies = anomalyBehaviorRepository.getTotalCountByUserAndTimeRange(userId, startOfDay, endOfDay);
        
        // 유형별 이상 행동 통계
        List<Object[]> typeStats = anomalyBehaviorRepository.getAnomalyTypeStatistics(userId, startOfDay, endOfDay);
        Map<String, Integer> anomalyTypeCounts = new HashMap<>();
        for (Object[] stat : typeStats) {
            String type = (String) stat[0];
            Long count = (Long) stat[1];
            anomalyTypeCounts.put(getAnomalyTypeName(type), count.intValue());
        }
        
        // CCTV 통계
        int totalCctvCount = cctvRepository.findByUser_UserId(userId).size();
        int activeCctvCount = totalCctvCount; // TODO: 실제 활성 상태 확인 로직 추가
        
        // 저장 공간 사용률
        double storageUsagePercentage = 0.0;
        try {
            var storageSpace = storageSpaceRepository.findByUserUserId(userId);
            if (storageSpace.isPresent()) {
                var storage = storageSpace.get();
                if (storage.getTotalSpace() > 0) {
                    storageUsagePercentage = (double) storage.getUsedSpace() / storage.getTotalSpace() * 100;
                }
            }
        } catch (Exception e) {
            log.warn("저장 공간 정보 조회 실패: {}", e.getMessage());
        }
        
        // 시스템 상태 결정
        String systemStatus = determineSystemStatus(totalAnomalies, storageUsagePercentage, activeCctvCount, totalCctvCount);
        
        // 주요 알림 사항
        String mainAlert = generateMainAlert(totalAnomalies, storageUsagePercentage, activeCctvCount, totalCctvCount);
        
        // 요약 메시지 생성
        String summaryMessage = generateSummaryMessage(date, totalAnomalies, anomalyTypeCounts, activeCctvCount, totalCctvCount);
        
        return DashboardSummaryResponse.builder()
                .summaryDate(date)
                .totalAnomalies(totalAnomalies.intValue())
                .anomalyTypeCounts(anomalyTypeCounts)
                .activeCctvCount(activeCctvCount)
                .totalCctvCount(totalCctvCount)
                .storageUsagePercentage(storageUsagePercentage)
                .systemStatus(systemStatus)
                .mainAlert(mainAlert)
                .summaryMessage(summaryMessage)
                .build();
    }
    
    /**
     * 이상 행동 유형 코드를 한국어 이름으로 변환
     */
    private String getAnomalyTypeName(String typeCode) {
        switch (typeCode) {
            case "TYPE1": return "전도";
            case "TYPE2": return "파손";
            case "TYPE3": return "방화";
            case "TYPE4": return "흡연";
            case "TYPE5": return "유기";
            case "TYPE6": return "절도";
            case "TYPE7": return "폭행";
            default: return typeCode;
        }
    }
    
    /**
     * 시스템 상태 결정
     */
    private String determineSystemStatus(Long totalAnomalies, double storageUsagePercentage, int activeCctvCount, int totalCctvCount) {
        if (totalAnomalies > 10 || storageUsagePercentage > 90 || activeCctvCount < totalCctvCount) {
            return "주의";
        } else if (totalAnomalies > 5 || storageUsagePercentage > 80) {
            return "보통";
        } else {
            return "정상";
        }
    }
    
    /**
     * 주요 알림 사항 생성
     */
    private String generateMainAlert(Long totalAnomalies, double storageUsagePercentage, int activeCctvCount, int totalCctvCount) {
        if (totalAnomalies > 10) {
            return "⚠️ 오늘 이상 행동이 " + totalAnomalies + "건 발생했습니다.";
        } else if (storageUsagePercentage > 90) {
            return "🚨 저장 공간이 90% 이상 사용되었습니다.";
        } else if (activeCctvCount < totalCctvCount) {
            return "📹 일부 CCTV가 비활성 상태입니다.";
        } else if (totalAnomalies > 0) {
            return "ℹ️ 오늘 " + totalAnomalies + "건의 이상 행동이 감지되었습니다.";
        } else {
            return "✅ 모든 시스템이 정상 작동 중입니다.";
        }
    }
    
    /**
     * 요약 메시지 생성
     */
    private String generateSummaryMessage(LocalDate date, Long totalAnomalies, Map<String, Integer> anomalyTypeCounts, int activeCctvCount, int totalCctvCount) {
        StringBuilder message = new StringBuilder();
        message.append(date.toString()).append(" 대시보드 요약:\n");
        message.append("• 이상 행동: ").append(totalAnomalies).append("건\n");
        message.append("• 활성 CCTV: ").append(activeCctvCount).append("/").append(totalCctvCount).append("대\n");
        
        if (!anomalyTypeCounts.isEmpty()) {
            message.append("• 주요 유형: ");
            anomalyTypeCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                    .limit(2)
                    .forEach(entry -> message.append(entry.getKey()).append("(").append(entry.getValue()).append("건) "));
            message.append("\n");
        }
        
        return message.toString();
    }
    
    /**
     * 월별 대시보드 데이터를 조회합니다
     * @param yyyyMM 년월 (예: "202412")
     * @param userId 사용자 ID
     * @return 월별 대시보드 데이터 목록
     */
    public List<Map<String, Object>> getMonthlyDashboard(String yyyyMM, Long userId) {
        log.info("월별 대시보드 조회: yyyyMM={}, userId={}", yyyyMM, userId);
        
        try {
            // yyyy-MM 또는 yyyyMM 모두 허용
            YearMonth ym;
            try {
                ym = YearMonth.parse(yyyyMM); // e.g. 2024-12
            } catch (Exception ignored) {
                // fallback: 202412 -> 2024-12
                if (yyyyMM != null && yyyyMM.length() == 6) {
                    String withDash = yyyyMM.substring(0, 4) + "-" + yyyyMM.substring(4);
                    ym = YearMonth.parse(withDash);
                } else {
                    throw new IllegalArgumentException("잘못된 날짜 형식입니다. YYYY-MM 또는 YYYYMM 형식으로 입력해주세요.");
                }
            }
            LocalDate startDate = ym.atDay(1);
            LocalDate endDate = ym.atEndOfMonth();
            
            List<Map<String, Object>> result = new ArrayList<>();
            
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", currentDate.toString());
                
                LocalDateTime dayStart = currentDate.atStartOfDay();
                LocalDateTime dayEnd = currentDate.plusDays(1).atStartOfDay();
                
                Long dayAnomalies = anomalyBehaviorRepository.getTotalCountByUserAndTimeRange(userId, dayStart, dayEnd);
                dayData.put("anomalyCount", dayAnomalies);
                
                List<Object[]> typeStats = anomalyBehaviorRepository.getAnomalyTypeStatistics(userId, dayStart, dayEnd);
                Map<String, Integer> typeCounts = new HashMap<>();
                for (Object[] stat : typeStats) {
                    String type = (String) stat[0];
                    Long count = (Long) stat[1];
                    typeCounts.put(getAnomalyTypeName(type), count.intValue());
                }
                dayData.put("anomalyTypes", typeCounts);
                
                int totalCctvCount = cctvRepository.findByUser_UserId(userId).size();
                dayData.put("totalCctvCount", totalCctvCount);
                dayData.put("activeCctvCount", totalCctvCount);
                
                result.add(dayData);
                currentDate = currentDate.plusDays(1);
            }
            
            return result;
            
        } catch (DateTimeParseException e) {
            log.error("날짜 형식 오류: yyyyMM={}", yyyyMM, e);
            throw new IllegalArgumentException("잘못된 날짜 형식입니다. YYYY-MM 또는 YYYYMM 형식으로 입력해주세요.");
        } catch (Exception e) {
            log.error("월별 대시보드 조회 실패: yyyyMM={}, userId={}", yyyyMM, userId, e);
            throw new RuntimeException("월별 대시보드 조회 중 오류가 발생했습니다.", e);
        }
    }
    
    /**
     * 이상 행동 발생 시 대시보드를 업데이트합니다
     * @param request 이상 행동 비디오 메타데이터 요청
     */
    @Transactional
    public void updateDashboardWithAnomaly(AnomalyVideoMetadataRequest request) {
        log.info("이상 행동으로 인한 대시보드 업데이트: userId={}, anomalyType={}",
                request.getUserId(), request.getAnomalyType());
        
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + request.getUserId()));
            
            // 이벤트 발생 날짜를 요청 타임스탬프에서 사용 (없으면 오늘)
            LocalDate eventDate = request.getTimestamp() != null ? request.getTimestamp().toLocalDate() : LocalDate.now();
            
            Dashboard dashboard = dashboardRepository.findByUserAndTime(user, eventDate)
                    .orElseGet(() -> {
                        Dashboard newDashboard = new Dashboard();
                        newDashboard.setUser(user);
                        newDashboard.setTime(eventDate);
                        newDashboard.setType1Count(0);
                        newDashboard.setType2Count(0);
                        newDashboard.setType3Count(0);
                        newDashboard.setType4Count(0);
                        newDashboard.setType5Count(0);
                        newDashboard.setType6Count(0);
                        newDashboard.setType7Count(0);
                        return newDashboard;
                    });
            
            // anomalyType이 TYPE코드인 경우 한글명으로 변환 후 키워드 매칭
            String anomalyTypeRaw = request.getAnomalyType() != null ? request.getAnomalyType() : "";
            String normalized;
            if (anomalyTypeRaw.startsWith("TYPE")) {
                normalized = getAnomalyTypeName(anomalyTypeRaw);
            } else {
                normalized = anomalyTypeRaw;
            }
            String lowerType = normalized.toLowerCase();
            
            if (lowerType.contains("전도")) dashboard.setType1Count(dashboard.getType1Count() + 1);
            else if (lowerType.contains("파손")) dashboard.setType2Count(dashboard.getType2Count() + 1);
            else if (lowerType.contains("방화")) dashboard.setType3Count(dashboard.getType3Count() + 1);
            else if (lowerType.contains("흡연")) dashboard.setType4Count(dashboard.getType4Count() + 1);
            else if (lowerType.contains("유기")) dashboard.setType5Count(dashboard.getType5Count() + 1);
            else if (lowerType.contains("절도")) dashboard.setType6Count(dashboard.getType6Count() + 1);
            else if (lowerType.contains("폭행")) dashboard.setType7Count(dashboard.getType7Count() + 1);
            else {
                // 미분류는 기타(type7)에 누적
                dashboard.setType7Count(dashboard.getType7Count() + 1);
            }
            
            dashboardRepository.save(dashboard);
            
            log.info("대시보드 업데이트 완료: userId={}, date={}, type={}",
                    request.getUserId(), eventDate, normalized);
            
        } catch (Exception e) {
            log.error("대시보드 업데이트 실패: request={}", request, e);
            throw new RuntimeException("대시보드 업데이트 중 오류가 발생했습니다.", e);
        }
    }
}