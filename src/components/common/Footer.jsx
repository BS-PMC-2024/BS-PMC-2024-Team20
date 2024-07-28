
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to="/terms-of-service" className="footer-link">
          תנאי שימוש
        </Link>
        <Link to="/contact-us" className="footer-link">
          צור קשר
        </Link>
      </div>
      <div className="footer-bottom">
        <p>© 2024 AI-AID. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
