import { api } from "./client";

/**
 * 챗봇에게 메시지를 전송하고 응답을 받습니다.
 * @param {string} message - 사용자가 입력한 메시지
 * @returns {Promise<ApiResponse>} 서버 응답
 */
export const postChatMessage = async (message) => {
  try {
    const response = await api.post("/chatbot/message", { message });
    // 백엔드의 ChatbotResponse 형식에 맞게 데이터 반환
    // 백엔드는 { "reply": "..." } 형식으로 응답하므로, response.data가 이 객체를 가리킴
    if (response.success) {
      return response.data.reply; // 성공 시 응답 메시지 텍스트만 반환
    } else {
      // 실패 시 기본 에러 메시지 반환
      return "죄송합니다. 답변을 드릴 수 없어요. 잠시 후 다시 시도해 주세요.";
    }
  } catch (error) {
    console.error("Chatbot API error:", error);
    return "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  }
};
