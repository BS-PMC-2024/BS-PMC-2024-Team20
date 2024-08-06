// src/components/ChatIcon.jsx
import React from 'react';
import '../../styles/chat.css'

const ChatIcon = () => {
  return (
    <div>
      <div className="chat-icon">💬</div>
      <div className="chat-tooltip">
        היי, אני AI-aid.<br />
        תוכל לפנות אליי לגבי טיפים רלוונטיים.
      </div>
    </div>
  );
};

export default ChatIcon;
