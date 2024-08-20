import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';
import '../../styles/Footer.css';
import { getAuth } from 'firebase/auth';
import { getRole } from '../../services/auth';
import '../../styles/transitionPages.css';

const Footer = () => { 
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    const fetchRole = async () => {
      if (currentUser) {
        const userRole = await getRole(currentUser.uid);
        setRole(userRole);
      }
    };
    fetchRole();
  }, [currentUser]);

  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to="/terms-of-service" className="footer-link">
          Terms Of Service
        </Link>
        {role === 'admin' && (
          <Link to="/contact-admin" className="footer-link">
            Contact Us
          </Link>
        )}

        {role !== 'admin' && (
          <Link to="/send-contact-admin" className="footer-link">
            Contact Us
          </Link>
        )}
      </div>
      <div className="footer-bottom">
        <p>© 2024 AI-AID. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
//git commit -m "BSPMS2420-47 - created by btn "