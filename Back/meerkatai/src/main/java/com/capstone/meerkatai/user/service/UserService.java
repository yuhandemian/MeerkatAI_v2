package com.capstone.meerkatai.user.service;

import com.capstone.meerkatai.user.entity.User;
import com.capstone.meerkatai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 사용자 관련 비즈니스 로직을 처리하는 서비스 클래스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    /**
     * 사용자의 설정 정보를 조회합니다 (챗봇용)
     * @param userId 사용자 ID
     * @return 사용자 설정 정보 문자열
     */
    public String getUserSettingsForChatbot(Long userId) {
        log.info("챗봇용 사용자 설정 조회: userId={}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + userId));
        
        return String.format(
                "👤 사용자 설정 정보\n\n" +
                "• 이름: %s\n" +
                "• 이메일: %s\n" +
                "• 알림 설정: %s\n" +
                "• 약관 동의: %s\n" +
                "• 최초 로그인: %s\n" +
                "• 마지막 로그인: %s\n" +
                "• 계정 생성일: %s\n" +
                "• 계정 수정일: %s",
                user.getName(),
                user.getEmail(),
                user.isNotification() ? "활성화" : "비활성화",
                user.isAgreement() ? "동의" : "미동의",
                user.isFirstLogin() ? "예" : "아니오",
                user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : "정보 없음",
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : "정보 없음",
                user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : "정보 없음"
        );
    }
    
    /**
     * 사용자의 알림 설정을 업데이트합니다 (챗봇용)
     * @param userId 사용자 ID
     * @param notificationStatus 알림 상태 (true: 활성화, false: 비활성화)
     * @return 업데이트 결과 메시지
     */
    @Transactional
    public String updateNotificationSettingsForChatbot(Long userId, boolean notificationStatus) {
        log.info("챗봇용 알림 설정 업데이트: userId={}, notificationStatus={}", userId, notificationStatus);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + userId));
        
        user.setNotification(notificationStatus);
        userRepository.save(user);
        
        String statusText = notificationStatus ? "활성화" : "비활성화";
        return String.format("✅ 알림 설정이 %s로 변경되었습니다.", statusText);
    }
    
    /**
     * 사용자 ID로 사용자를 조회합니다
     * @param userId 사용자 ID
     * @return 사용자 엔티티 (없으면 null)
     */
    public User getUserById(Long userId) {
        log.info("사용자 조회: userId={}", userId);
        
        return userRepository.findById(userId).orElse(null);
    }
    
    /**
     * 사용자의 알림 상태를 업데이트합니다
     * @param userId 사용자 ID
     * @param notification 알림 상태
     * @return 업데이트 성공 여부
     */
    @Transactional
    public boolean updateNotificationStatus(Long userId, boolean notification) {
        log.info("알림 상태 업데이트: userId={}, notification={}", userId, notification);
        
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + userId));
            
            user.setNotification(notification);
            userRepository.save(user);
            
            return true;
        } catch (Exception e) {
            log.error("알림 상태 업데이트 실패: userId={}, notification={}", userId, notification, e);
            return false;
        }
    }
    
    /**
     * 사용자 설정 정보를 조회합니다 (챗봇용)
     * @param userId 사용자 ID
     * @return 사용자 엔티티
     */
    public User getUserSettings(Long userId) {
        log.info("사용자 설정 조회: userId={}", userId);
        
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + userId));
    }
    
    /**
     * 사용자의 알림 설정을 업데이트합니다 (챗봇용)
     * @param userId 사용자 ID
     * @param enableNotification 알림 활성화 여부
     * @return 업데이트된 사용자 엔티티
     */
    @Transactional
    public User updateNotificationSettings(Long userId, boolean enableNotification) {
        log.info("알림 설정 업데이트: userId={}, enableNotification={}", userId, enableNotification);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + userId));
        
        user.setNotification(enableNotification);
        return userRepository.save(user);
    }
}