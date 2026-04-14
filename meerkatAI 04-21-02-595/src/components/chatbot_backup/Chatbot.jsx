import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import styles from './Chatbot.module.scss';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && <ChatWindow closeChat={() => setIsOpen(false)} />}
      <button className={styles.chatbotButton} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'X' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;
