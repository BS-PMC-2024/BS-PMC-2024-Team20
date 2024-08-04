import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { AdminConversation } from '../../services/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../connections/firebaseConfig'; 
import '../../styles/Communication.css'; 
//git commit - m "BSPMS2420-48-create new window to display message for admin"
const ContactAdmin = () => {
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) {
        return;
      }

      try {
        //get the messages
        const AdminConv = await AdminConversation(currentUser.email, 'admin');
        setMessages(AdminConv);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentUser]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'userMessages', messageId));
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="communication-container">
      <h1>Admin Communication</h1>
      <div className="messages-container">
        <div className="messages-section">
          <h2>All Messages</h2>
          {messages.length === 0 ? (
            <p>No messages received.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message">
                <p><strong>{msg.fromUser}:</strong> {msg.message}</p>
                <small>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</small>
                <button onClick={() => handleDeleteMessage(msg.id)}>Done</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
