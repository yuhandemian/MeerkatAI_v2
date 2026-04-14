import React, { useState, useRef, useEffect } from 'react';
import { postChatMessage } from '../../apis/chatbotApi';
import styles from './Chatbot.module.scss';

const ChatWindow = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    { 
      sender: '', 
      text: '🤖 안녕하세요! Meerkat AI 어시스턴트입니다.\n\n저는 다음과 같은 업무를 도와드릴 수 있어요:\n\n🔍 이상 행동 검색 및 분석\n📊 통계 및 트렌드 분석\n📹 CCTV 목록 및 상태 확인\n💾 저장 공간 정보 조회\n🎥 최근 영상 및 상세 정보\n⚙️ 시스템 설정 관리\n\n궁금한 점이 있으시면 언제든 말씀해 주세요! 😊',
      timestamp: new Date()
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { 
      sender: 'user', 
      text: inputValue.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botReply = await postChatMessage(inputValue.trim());
      const botMessage = { 
        sender: '', 
        text: botReply,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('챗봇 오류:', error);
      const errorMessage = { 
        sender: '', 
        text: '🔧 죄송합니다. 일시적으로 시스템에 문제가 발생했습니다.\n\n잠시 후 다시 시도해주시거나, 다른 질문을 해보세요.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const LoadingDots = () => (
    <div className={styles.loading}>
      <div className={styles.loadingDots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span style={{ marginLeft: '8px', fontSize: '12px', color: '#667eea' }}>
        AI가 생각중이에요...
      </span>
    </div>
  );

  const QuickActions = () => (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '8px', 
      marginTop: '10px',
      marginBottom: '15px'
    }}>
      {[
        '📊 최근 이상 행동 통계',
        '📹 CCTV 목록 보기',
        '💾 저장 공간 확인',
        '🎥 최근 영상 조회'
      ].map((action, index) => (
        <button
          key={index}
          onClick={() => setInputValue(action.substring(2))}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '15px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            flex: '1 1 calc(50% - 4px)',
            minWidth: '120px',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#667eea';
            e.target.style.color = 'white';
            e.target.style.borderColor = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8f9fa';
            e.target.style.color = 'inherit';
            e.target.style.borderColor = '#e9ecef';
          }}
        >
          {action}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ marginRight: '8px', fontSize: '16px' }}>🤖</span>
          Meerkat AI Assistant
          <span style={{ marginLeft: '8px', fontSize: '16px' }}>⚡</span>
        </div>
        <button 
          onClick={closeChat}
          style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ✕
        </button>
      </div>
      
      <div className={styles.messageContainer}>
        <QuickActions />
        
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
            {msg.sender === 'bot' ? (
              // 봇 메시지 - 아이콘 포함
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  minWidth: '20px',
                  opacity: 0.8
                }}>
                  ��
                </div>
                <div style={{ flex: 1 }}>
                  {msg.text}
                  <div style={{ 
                    fontSize: '10px', 
                    opacity: 0.6, 
                    marginTop: '4px',
                    textAlign: 'left',
                    fontStyle: 'italic'
                  }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ) : (
              // 사용자 메시지 - 아이콘 없음, 깔끔한 스타일
              <div>
                {msg.text}
                <div style={{ 
                  fontSize: '10px', 
                  opacity: 0.6, 
                  marginTop: '4px',
                  textAlign: 'right',
                  fontStyle: 'italic'
                }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>🤖</div>
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      
      <form className={styles.inputForm} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요... (Enter: 전송)"
          disabled={isLoading}
          maxLength={500}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          {isLoading ? (
            <span style={{ fontSize: '14px' }}>⏳</span>
          ) : (
            <span style={{ fontSize: '14px' }}>🚀</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
