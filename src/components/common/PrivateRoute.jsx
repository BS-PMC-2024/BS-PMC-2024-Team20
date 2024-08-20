// src/components/common/PrivateRoute.jsx
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getRole } from '../../services/auth';
import '../../styles/transitionPages.css';

const PrivateRoute = ({ children, allowedRoles, ...rest }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [role, setRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const userRole = await getRole();
        setRole(userRole);
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user || !allowedRoles.includes(role)) {
    return <Redirect to="/" />;
  }

  return <Route {...rest}>{children}</Route>;
};

export default PrivateRoute;
