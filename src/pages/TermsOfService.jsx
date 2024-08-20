// src/pages/TermsOfService.jsx
import React from 'react';
import './../styles/common.css';

const TermsOfService = () => {
  return (
    <>
      <h1>Terms of Service</h1>
      <section>
        <h2><i className="fas fa-info-circle"></i> Welcome</h2>
        <p>Welcome to our Terms of Service page. Here you can find the rules and regulations for using our website.</p>
      </section>
      <section>
        <h2><i className="fas fa-balance-scale"></i> General Conditions</h2>
        <ul>
          <li>The user agrees to use the website responsibly.</li>
          <li>The user agrees not to misuse the website or its services.</li>
          <li>All information provided by the user must be accurate.</li>
          <li>The website will not be responsible for any misuse of its services by the user.</li>
          <li>The user agrees to comply with all applicable laws and regulations.</li>
        </ul>
      </section>
      <section>
        <h2><i className="fas fa-user-shield"></i> Privacy Policy</h2>
        <ul>
          <li>The user agrees to keep the personal information of other users confidential.</li>
          <li>The website reserves the right to change the terms of service at any time without prior notice.</li>
          <li>The user agrees not to post any offensive, defamatory, or copyright-infringing content.</li>
        </ul>
      </section>
      <section>
        <h2><i className="fas fa-business-time"></i> Commercial Use</h2>
        <ul>
          <li>The user agrees not to use the website for commercial purposes without explicit permission from the site management.</li>
          <li>The user agrees not to attempt to hack the website or engage in malicious activities.</li>
          <li>The user agrees not to share their login details with others.</li>
        </ul>
      </section>
      <section>
        <h2><i className="fas fa-shield-alt"></i> Rights and Responsibilities</h2>
        <ul>
          <li>The website reserves the right to block access to users who violate the terms of service.</li>
          <li>The website will not be liable for any damages resulting from the use of the website.</li>
        </ul>
      </section>
    </>
  );
};

export default TermsOfService;
