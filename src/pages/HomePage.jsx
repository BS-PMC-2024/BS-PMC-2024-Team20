// src/pages/HomePage.jsx
import React from 'react';
import '../styles/common.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to AI-AID</h1>
      <p className="homepage-intro">AI-AID</p>
      <p className="homepage-intro">This project was created by a team of technology and education experts with the goal of assisting students with learning difficulties using advanced artificial intelligence tools.</p>
      <p className="homepage-mission">Our project offers personalized solutions, learning tips, and time management through a user-friendly interface.</p>
      <p className="homepage-goal">Our goal is to provide support and help students succeed in their studies with the aid of advanced technologies.</p>
      <div className="homepage-features">
        <h2>Features</h2>
        <ul>
          <li>Personalized solutions</li>
          <li>Learning tips</li>
          <li>Time management</li>
          <li>User-friendly interface</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;

