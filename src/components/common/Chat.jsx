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
       Chat With Ai-aid
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
          placeholder="Type here your message... "
        />
        <button onClick={sendMessage}>SEND</button>
      </div>
      <div className="chat-guidelines">
    <h2>Instructions for an effective conversation with our chat:</h2>
    <ul>
        <li>Use respectful and polite language</li>
        <li>Be clear and concise with your questions</li>
        <li>Here are examples of starting a conversation with our chat:
            <ul>
                <li>Hi Chat, I need help with time management</li>
                <li>Hi Chat, I have a really hard time studying in the mornings</li>
            </ul>
        </li>
        <li>Please avoid inappropriate language</li>
        <li>Do not share sensitive personal information.</li>
    </ul>
    </div>

    </>
    
  );
};

export default Chat;
