import React from 'react';
<<<<<<< HEAD
import '../../styles/common.css'; 
=======
import '../../styles/common.css'; // כולל את קובץ ה-CSS המאוחד
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24

const LogoutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>התנתקת בהצלחה</h2>
        <img src="/path/to/logo.png" alt="Logo" className="logout-logo" />
        <button onClick={onClose}>אישור</button>
      </div>
    </div>
  );
};

export default LogoutModal;
