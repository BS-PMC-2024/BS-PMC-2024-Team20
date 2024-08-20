import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/iconPop-up.css';
import '../../styles/transitionPages.css';

const ChatIcon = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null; // אם החלון סגור, לא להציג כלום
  }

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span className="chat-close" onClick={handleClose}>✖</span>
      </div>
      <div className="chat-body">
        <div className="chat-icon">💬</div>
        <div className="chat-tooltip">
          You can ask me anything! <br />
          <Link to="/chat">chat with AI</Link>
        </div>
      </div>
    </div>
  );
};

export default ChatIcon;
