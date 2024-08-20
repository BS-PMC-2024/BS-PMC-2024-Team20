import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { receiveMessages, sendMessage, markMessageAsRead } from '../../services/auth'; 
import '../../styles/Communication.css';

const TeacherStudentCom = () => {
  const [conversation, setConversation] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [status, setStatus] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) {
        setStatus('You need to be logged in.');
        return;
      }

      try {
        const conv = await receiveMessages(currentUser.email, 'student');
        console.log('Received messages:', conv);
        setConversation(conv);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentUser]);

  const handleReply = async (studentEmail, messageId) => {
    if (!replyMessage) {
      setStatus('Reply message cannot be empty.');
      return;
    }

    try {
      await sendMessage(
        'teacher',
        currentUser.email,
        'student',
        studentEmail,
        replyMessage
      );
      setReplyMessage('');
      setStatus('Reply sent successfully.');

      // Refresh conversation
      const conv = await receiveMessages(currentUser.email, 'student');
      setConversation(conv);
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      setStatus('Failed to send reply.');
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      const updatedConversation = conversation.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      );
      setConversation(updatedConversation);
    } catch (error) {
      console.error('Error marking message as read:', error);
      setStatus('Failed to mark message as read.');
    }
  };

  return (
    <div className="communication-container">
      <h2>Student Messages</h2>
      <div className="conversation-container">
        {conversation.map((msg) => (
          <div key={msg.id} className={`message ${msg.fromUser === currentUser.email ? 'from-user' : 'to-user'}`}>
            <p><strong>{msg.fromUser}</strong></p>
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</small>
            <div className="button-group">
              {msg.fromUser !== currentUser.email && !msg.isRead && (
                <button className="button-action" onClick={() => handleMarkAsRead(msg.id)}>Read</button>
              )}
              {msg.fromRole === 'student' && (
                <button className="button-action" onClick={() => setReplyTo(msg.fromUser)}>Reply</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {replyTo && (
        <div className="reply-form">
          <h3>Reply to {replyTo}</h3>
          <textarea
            placeholder="Write your reply here..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          ></textarea>
          <button className="button-action" onClick={() => handleReply(replyTo)}>Send Reply</button>
          {status && <p className="status-message">{status}</p>}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentCom;
