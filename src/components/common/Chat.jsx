//BSPMS2420-38 - chat with ai!
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('http://localhost:3002/api/chat', { message: input });
      console.log('Full response:', response);
      console.log('Response data:', response.data);

      // בדוק שהתגובה מכילה את המידע הצפוי
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const botMessage = { role: 'bot', content: response.data.choices[0].message.content };
        setMessages([...messages, userMessage, botMessage]);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setInput('');
  };

  return (
    <>
      <div className="chat-header">
        צ'אט עם AI
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'user-message' : 'bot-message'}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="הקלד את הודעתך..."
        />
        <button onClick={sendMessage}>שלח</button>
      </div>
      <div className="chat-guidelines">
        <h3>הנחיות לשיחה בצ'אט</h3>
        <ul>
          <li>השתמש בשפה מכובדת ומנומסת.</li>
          <li>היה ברור ותמציתי בשאלותיך.</li>
          <li>דוגמאות לאיך לשאול שאלות:</li>
          <ul>
            <li>"האם תוכל לעזור לי בשיעורי הבית?"</li>
            <li>"מהי בירת צרפת?"</li>
            <li>"הסבר את תורת היחסות."</li>
          </ul>
          <li>נא להימנע משימוש בשפה פוגענית או לא הולמת.</li>
          <li>אל תשתף מידע אישי או רגיש.</li>
        </ul>
      </div>
    </>
    
  );
};

export default Chat;
