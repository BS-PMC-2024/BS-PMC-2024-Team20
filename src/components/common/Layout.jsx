// src/components/common/Layout.jsx
import React from 'react';
import TopNavbar from './TopNavbar';
import SideNavbar from './SideNavbar';
import '../../styles/common.css';
import '../../styles/transitionPages.css';

const Layout = ({ children, user, role, onOpenLogin, onLogout }) => {
  return (
    <div className="container">
      <TopNavbar user={user} onOpenLogin={onOpenLogin} onLogout={onLogout} />
      <div className="main-content-wrapper">
        <SideNavbar role={role} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
