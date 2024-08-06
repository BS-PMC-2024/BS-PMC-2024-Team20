import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getAllUsers, sendMessage, receiveMessages, getRole } from '../../services/auth';
import '../../styles/Communication.css';
import '../../styles/common.css';

const SendContactAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [status, setStatus] = useState('');
  const [role, setRole] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        
        return;
      }

      try {
        // קבלת רשימת המשתמשים ומציאת האדמינים
        const users = await getAllUsers();
        const adminList = users.filter(user => user.role === 'admin');
        setAdmins(adminList);

        // קבלת הודעות קודמות עם האדמינים
        const conv = await receiveMessages(currentUser.email, 'admin');
        setConversation(conv);

        // קבלת תפקיד המשתמש
        const userRole = await getRole(currentUser.uid);
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStatus('Error fetching data.');
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSendMessage = async () => {
    if (!currentUser) {
      return;
    }

    if (!selectedAdmin) {
      setStatus('Please select an admin.');
      return;
    }
    if (!message) {
      setStatus('Message cannot be empty.');
      return;
    }

    try {
      console.log(role, currentUser.email, message);
      await sendMessage(
        role,
        currentUser.email,
        'admin',
        selectedAdmin,
        message
      );
      setMessage('');
      setStatus('Message sent successfully.');

      // רענון השיחה לאחר שליחת ההודעה
      const conv = await receiveMessages(currentUser.email, 'admin');
      setConversation(conv);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="communication-container">
      <h2>Contact Admin</h2>
      {currentUser && (
        <div className="communication-form">
          <label htmlFor="admin-select">Choose an admin:</label>
          <select
            id="admin-select"
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
          >
            <option value="">--Select an Admin--</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.email}>
                {admin.firstName} {admin.lastName}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button onClick={handleSendMessage}>Send Message</button>
          {status && <p className="status-message">{status}</p>}
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

export default SendContactAdmin;
