import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { receiveMessages, sendMessage } from '../../services/auth';
import '../../styles/Communication.css';

const TeacherStudentCom = () => {
  const [conversation, setConversation] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [repliedMessages, setRepliedMessages] = useState(new Set()); // Tracking replies
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

  const handleReply = async (studentEmail) => {
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
      setRepliedMessages(new Set([...repliedMessages, studentEmail])); // Add this student to the replied set

      // Refresh conversation
      const conv = await receiveMessages(currentUser.email, 'student');
      setConversation(conv);
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      setStatus('Failed to send reply.');
    }
  };

  return (
    <div className="communication-container">
      <h2>Student Messages</h2>
      <div className="conversation-container">
        {conversation.map((msg) => (
          <div key={msg.id} className="message">
            <p><strong>{msg.fromUser}:</strong> {msg.message}</p>
            <small>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</small>
            {msg.fromRole === 'student' && !repliedMessages.has(msg.fromUser) && (
              <button onClick={() => setReplyTo(msg.fromUser)}>Reply</button>
            )}
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
          <button onClick={() => handleReply(replyTo)}>Send Reply</button>
          {status && <p className="status-message">{status}</p>}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentCom;