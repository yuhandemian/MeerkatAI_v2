import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import styles from './Chatbot.module.scss';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 웰컴 애니메이션
    const timer = setTimeout(() => {
      setHasNewMessage(true);
      const resetTimer = setTimeout(() => setHasNewMessage(false), 3000);
      return () => clearTimeout(resetTimer);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  // AI/로봇 느낌나는 아이콘들
  const ChatbotIcon = () => {
    if (isOpen) {
      // 닫기 아이콘 - X 표시
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      );
    }

    // 메인 AI 로봇 아이콘 - 미래적인 로봇 헤드
    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* 로봇 헤드 */}
        <svg width="64" height="64" viewBox="0 0 100 100" fill="currentColor">
          {/* 안테나 */}
          <circle cx="50" cy="8" r="3"/>
          <line x1="50" y1="11" x2="50" y2="20" stroke="currentColor" strokeWidth="2"/>
          
          {/* 헤드 메인 */}
          <rect x="25" y="20" width="50" height="55" rx="8" ry="8" fill="currentColor"/>
          
          {/* 눈 - LED 스타일 */}
          <circle cx="38" cy="40" r="6" fill="white"/>
          <circle cx="62" cy="40" r="6" fill="white"/>
          <circle cx="38" cy="40" r="3" fill="#00ffff"/>
          <circle cx="62" cy="40" r="3" fill="#00ffff"/>
          
          {/* 눈 하이라이트 */}
          <circle cx="39" cy="38" r="1.5" fill="white"/>
          <circle cx="63" cy="38" r="1.5" fill="white"/>
          
          {/* 입 - 디지털 스타일 */}
          <rect x="40" y="55" width="4" height="2" fill="white"/>
          <rect x="46" y="55" width="8" height="2" fill="white"/>
          <rect x="56" y="55" width="4" height="2" fill="white"/>
          
          {/* 사이드 패널 */}
          <rect x="20" y="30" width="3" height="20" rx="1.5" fill="rgba(255,255,255,0.3)"/>
          <rect x="77" y="30" width="3" height="20" rx="1.5" fill="rgba(255,255,255,0.3)"/>
          
          {/* 목/연결부 */}
          <rect x="45" y="75" width="10" height="8" rx="2" fill="currentColor"/>
        </svg>
        
        {/* AI 효과 - 펄스링 */}
        <div style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          border: '2px solid rgba(0, 255, 255, 0.3)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}></div>
      </div>
    );
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && <ChatWindow closeChat={() => setIsOpen(false)} />}
      <button 
        className={`${styles.chatbotButton} ${hasNewMessage ? styles.pulse : ''}`} 
        onClick={handleToggleChat}
        title={isOpen ? '챗봇 닫기' : 'Meerkat AI 챗봇 열기'}
        aria-label={isOpen ? '챗봇 닫기' : '챗봇 열기'}
      >
        <ChatbotIcon />
      </button>
      {hasNewMessage && !isOpen && (
        <div className={styles.notification}>
          AI 어시스턴트가 도움을 드릴 준비가 되었어요! 🤖
        </div>
      )}
    </div>
  );
};

export default Chatbot;
