package com.capstone.meerkatai.anomalybehavior.repository;

import com.capstone.meerkatai.anomalybehavior.entity.AnomalyBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;


public interface AnomalyBehaviorRepository extends JpaRepository<AnomalyBehavior, Long> {
    // 사용자 ID로 이상행동 목록 조회
    List<AnomalyBehavior> findByUserUserId(Long userId);

    void deleteByUserUserId(Long userId);

    // 챗봇 검색을 위한 추가 메서드
    List<AnomalyBehavior> findByAnomalyBehaviorType(String anomalyBehaviorType);
    List<AnomalyBehavior> findByAnomalyTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    List<AnomalyBehavior> findByAnomalyBehaviorTypeAndAnomalyTimeBetween(String anomalyBehaviorType, LocalDateTime startTime, LocalDateTime endTime);
    List<AnomalyBehavior> findByStreamingVideoCctvCctvName(String cctvName);
    List<AnomalyBehavior> findByAnomalyBehaviorTypeAndStreamingVideoCctvCctvName(String anomalyBehaviorType, String cctvName);
    
    // 트렌드 분석을 위한 쿼리 메서드들
    @Query("SELECT ab.anomalyBehaviorType as type, COUNT(ab) as count " +
           "FROM AnomalyBehavior ab " +
           "WHERE ab.user.userId = :userId " +
           "AND ab.anomalyTime >= :startTime AND ab.anomalyTime < :endTime " +
           "GROUP BY ab.anomalyBehaviorType")
    List<Object[]> getAnomalyTypeStatistics(@Param("userId") Long userId, 
                                           @Param("startTime") LocalDateTime startTime, 
                                           @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT HOUR(ab.anomalyTime) as hour, COUNT(ab) as count " +
           "FROM AnomalyBehavior ab " +
           "WHERE ab.user.userId = :userId " +
           "AND ab.anomalyTime >= :startTime AND ab.anomalyTime < :endTime " +
           "GROUP BY HOUR(ab.anomalyTime) " +
           "ORDER BY HOUR(ab.anomalyTime)")
    List<Object[]> getHourlyStatistics(@Param("userId") Long userId, 
                                      @Param("startTime") LocalDateTime startTime, 
                                      @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT DAYOFWEEK(ab.anomalyTime) as dayOfWeek, COUNT(ab) as count " +
           "FROM AnomalyBehavior ab " +
           "WHERE ab.user.userId = :userId " +
           "AND ab.anomalyTime >= :startTime AND ab.anomalyTime < :endTime " +
           "GROUP BY DAYOFWEEK(ab.anomalyTime) " +
           "ORDER BY DAYOFWEEK(ab.anomalyTime)")
    List<Object[]> getDailyStatistics(@Param("userId") Long userId, 
                                     @Param("startTime") LocalDateTime startTime, 
                                     @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT sv.cctv.cctvName as cctvName, COUNT(ab) as count " +
           "FROM AnomalyBehavior ab " +
           "JOIN ab.streamingVideo sv " +
           "WHERE ab.user.userId = :userId " +
           "AND ab.anomalyTime >= :startTime AND ab.anomalyTime < :endTime " +
           "GROUP BY sv.cctv.cctvName " +
           "ORDER BY COUNT(ab) DESC")
    List<Object[]> getCctvStatistics(@Param("userId") Long userId, 
                                    @Param("startTime") LocalDateTime startTime, 
                                    @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT COUNT(ab) " +
           "FROM AnomalyBehavior ab " +
           "WHERE ab.user.userId = :userId " +
           "AND ab.anomalyTime >= :startTime AND ab.anomalyTime < :endTime")
    Long getTotalCountByUserAndTimeRange(@Param("userId") Long userId, 
                                        @Param("startTime") LocalDateTime startTime, 
                                        @Param("endTime") LocalDateTime endTime);
}