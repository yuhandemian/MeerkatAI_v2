import React, { useState, useRef, useEffect } from 'react';
import { postChatMessage } from '../../apis/chatbotApi';
import styles from './Chatbot.module.scss';

const ChatWindow = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 궁금한 점을 물어보세요.' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botReply = await postChatMessage(inputValue);
      const botMessage = { sender: 'bot', text: botReply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: '오류가 발생했습니다. 다시 시도해주세요.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>Meerkat AI 챗봇</div>
      <div className={styles.messageContainer}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className={`${styles.message} ${styles.botMessage}`}>...</div>}
        <div ref={messageEndRef} />
      </div>
      <form className={styles.inputForm} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>{isLoading ? '...' : '전송'}</button>
      </form>
    </div>
  );
};

export default ChatWindow;
