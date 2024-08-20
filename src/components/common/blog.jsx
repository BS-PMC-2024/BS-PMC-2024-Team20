import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getRole, fetchBlogMessages, addBlogMessage, clearBlog,getRoleByEmail } from '../../services/auth'; 
import '../../styles/common.css';
import '../../styles/blog.css';
import '../../styles/transitionPages.css';

const auth = getAuth();

const Blog = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messagesWithRoles, setMessagesWithRoles] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesList = await fetchBlogMessages();

      const messagesWithRolesPromises = messagesList.map(async (message) => {
        const userRole = await getRoleByEmail(message.sender); // Get the correct role by email
        return { ...message, role: userRole };
      });

      const resolvedMessages = await Promise.all(messagesWithRolesPromises);
      setMessagesWithRoles(resolvedMessages);
    };

    fetchMessages();

    const fetchUserRole = async () => {
      const userRole = await getRoleByEmail(auth.currentUser.email); // Ensure you're fetching the current user's role correctly
      setRole(userRole);
    };

    fetchUserRole();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.length > 100) {
      setErrorMessage('Message cannot exceed 100 characters.');
      setNewMessage('');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('You need to be logged in to post a message.');
      return;
    }

    await addBlogMessage(newMessage, user.email);

    setNewMessage('');
    setErrorMessage('');
    const messagesList = await fetchBlogMessages();

    const messagesWithRolesPromises = messagesList.map(async (message) => {
      const userRole = await getRoleByEmail(message.sender); // Fetch role by email for each message
      return { ...message, role: userRole };
    });

    const resolvedMessages = await Promise.all(messagesWithRolesPromises);
    setMessagesWithRoles(resolvedMessages);
  };

  const handleClearBlog = async () => {
    await clearBlog();
    setMessagesWithRoles([]);
  };

  return (
    <div className="blog-container">
      <h2>Blog</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form className="blog-form" onSubmit={handleSubmit}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write your message here (max 100 characters)..."
        ></textarea>
        <button type="submit">Post Message</button>
      </form>
      {role === 'admin' && (
        <button className="blog-clear-button" onClick={handleClearBlog}>Clear Blog</button>
      )}
      <div className="blog-messages">
        {messagesWithRoles.map((message) => (
          <div key={message.id} className="blog-message">
            <p>{message.content}</p>
            <small>
              {message.sender} ({message.role || 'No Role'}) - {new Date(message.timestamp?.seconds * 1000).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;