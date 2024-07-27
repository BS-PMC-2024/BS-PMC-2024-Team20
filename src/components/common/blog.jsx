// ai-aid/src/components/common/Blog.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getRole, fetchBlogMessages, addBlogMessage, clearBlog } from '../../services/auth'; 
import '../../styles/blog.css';

const auth = getAuth();

const Blog = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesList = await fetchBlogMessages();
      setMessages(messagesList);
    };

    fetchMessages();

    const fetchUserRole = async () => {
      const userRole = await getRole();
      setRole(userRole);
    };

    fetchUserRole();
  }, []);
//limitation on the message to be sent only 100 characters at a time
//add an error message to the blog 
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
    setMessages(messagesList);
  };

  const handleClearBlog = async () => {
    await clearBlog();
    setMessages([]);
  };

  return (
    <div className="main-content"> 
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
          {messages.map((message) => (
            <div key={message.id} className="blog-message">
              <p>{message.content}</p>
              <small>{message.sender} - {new Date(message.timestamp?.seconds * 1000).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
