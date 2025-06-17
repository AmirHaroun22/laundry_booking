// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Bookings from './components/Bookings';
import LoginForm from './components/LoginForm';
import { fetchCurrentUser } from './utils/auth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const checkAuth = useCallback(async() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
          return;
        }
        setIsAuthenticated(true);
        const username = await fetchCurrentUser();
        setUser(username);
      } catch (error) {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    checkAuth();
    
    const interval = setInterval(checkAuth, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const handleLogin = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
      <main>
        {isAuthenticated ? (
          <Bookings />
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;