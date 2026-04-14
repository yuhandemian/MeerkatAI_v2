package com.capstone.meerkatai.video.repository;

import com.capstone.meerkatai.video.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByUserUserId(Long userId);
    List<Video> findByStreamingVideoStreamingVideoId(Long streamingVideoId);
    List<Video> findByUser_UserIdAndVideoIdIn(Long userId, List<Long> videoIds);
    Optional<Video> findByUserUserIdAndVideoId(Long userId, Long videoId);

    List<Video> findByUserUserIdOrderByAnomalyBehavior_AnomalyTimeDesc(Long userId);

    void deleteByUserUserId(Long userId);
    
    // 챗봇용 추가 메서드
    Optional<Video> findByVideoIdAndUserUserId(Long videoId, Long userId);
    
    // 페이지네이션을 위한 메서드
    Page<Video> findByUserUserId(Long userId, Pageable pageable);
}