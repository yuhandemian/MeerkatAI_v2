package com.capstone.meerkatai.chatbot.controller;

import com.capstone.meerkatai.chatbot.dto.ChatbotRequest;
import com.capstone.meerkatai.chatbot.dto.ChatbotResponse;
import com.capstone.meerkatai.chatbot.service.ChatbotService;
import com.capstone.meerkatai.common.dto.ApiResponse;
import com.capstone.meerkatai.user.entity.User;
import com.capstone.meerkatai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final UserRepository userRepository; // For JWT authentication pattern

    @PostMapping("/message")
    public ApiResponse<ChatbotResponse> handleChatbotMessage(@RequestBody ChatbotRequest request) {
        try {
            // JWT 인증 패턴 적용: 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName(); // 사용자 이메일 (JWT에서 추출)

            // 사용자 존재 여부 확인
            if (email == null || email.isEmpty()) {
                return ApiResponse.error("인증된 사용자 정보를 찾을 수 없습니다.");
            }

            ChatbotResponse response = chatbotService.processMessage(request.getMessage());
            return ApiResponse.success(response);
        } catch (Exception e) {
            return ApiResponse.error("챗봇 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
