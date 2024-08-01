import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getAllUsers, sendMessage, receiveMessages } from '../../services/auth';
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

  return (
    
    <div className="communication-container">
      <h2>Communication</h2>
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
          <button onClick={handleSendMessage}>Send Message</button> {/*//git commit -m "BSPMS2420-35 create btn for com (StudentToTeacherCom)" */}
          {status && <p className="status-message">{status}</p>} {/*git commit -m "BSPMS2420-36 create page for com (StudentToTeacherCom)" */}
        </div>
      )}
      <div className="conversation-container">
        <h3>Conversation</h3>
        {conversation.map((msg) => (
          <div key={msg.id} className="message">
            <p><strong>{msg.fromUser}:</strong> {msg.message}</p>
            <small>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTeacherCom;
