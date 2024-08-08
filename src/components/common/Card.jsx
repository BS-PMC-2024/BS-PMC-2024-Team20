// components/student/Card.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Card = ({ icon, title, children }) => (
  <div className="card">
    <div className="card-icon">
      <FontAwesomeIcon icon={icon} />
    </div>
    <h2>{title}</h2>
    <div className="card-content">
      {children}
    </div>
  </div>
);

export default Card;
