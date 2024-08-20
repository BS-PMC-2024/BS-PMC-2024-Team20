import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getAllUsers, sendMessage, receiveMessages, markMessageAsRead } from '../../services/auth'; 
import '../../styles/Communication.css';
import '../../styles/common.css';

const StudentTeacherCom = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [status, setStatus] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        return;
      }

      try {
        const users = await getAllUsers();
        const teacherList = users.filter(user => user.role === 'teacher');
        setTeachers(teacherList);

        const conv = await receiveMessages(currentUser.email, 'teacher');
        setConversation(conv);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSendMessage = async () => {
    if (!currentUser) {
      return;
    }

    if (!selectedTeacher) {
      setStatus('Please select a teacher.');
      return;
    }
    if (!message) {
      setStatus('Message cannot be empty.');
      return;
    }

    try {
      await sendMessage(
        'student',
        currentUser.email,
        'teacher',
        selectedTeacher,
        message
      );
      setMessage('');
      setStatus('Message sent successfully.');

      // Refresh conversation
      const conv = await receiveMessages(currentUser.email, 'teacher');
      setConversation(conv);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Failed to send message.');
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

  const handleReply = (teacherEmail) => {
    setSelectedTeacher(teacherEmail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="message-form-container">
        {currentUser && (
          <div className="communication-form">
            <label htmlFor="teacher-select">Choose a teacher:</label>
            <select
              id="teacher-select"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">--Select a Teacher--</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.email}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>                              
            <button className="button-action" onClick={handleSendMessage}>Send Message</button> 
            {status && <p className="status-message">{status}</p>} 
          </div>
        )}
      </div>
      
      <div className="conversation-container">
        {conversation.map((msg) => (
          <div key={msg.id} className={`message ${msg.fromUser === currentUser.email ? 'from-user' : 'to-user'}`}>
            <p><strong>{msg.fromUser}</strong></p>
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</small>
            <div className="button-group">
              {msg.fromUser !== currentUser.email && !msg.isRead && (
                <button className="button-action" onClick={() => handleMarkAsRead(msg.id)}>נקרא</button>
              )}
              {msg.fromRole === 'teacher' && (
                <button className="button-action" onClick={() => handleReply(msg.fromUser)}>Reply</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentTeacherCom;
