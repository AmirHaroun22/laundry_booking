import React from 'react';
import './Header.css';

function Header({ isAuthenticated, onLogout, user }) {
  return (
    <header className="header">
      <h2 className="header-title">The Great RVB Laundry Booking</h2>
      
      <div className="header-user-container">
        {isAuthenticated && (
          <>
            <span className="header-user-info">
              <span className="header-user-label">Logged in as</span>
              <strong>{user}</strong>
            </span>
            <button 
              onClick={onLogout}
              className="header-logout-button"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;