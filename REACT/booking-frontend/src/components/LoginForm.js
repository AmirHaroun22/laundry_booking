import React, { useState } from 'react';
import './LoginForm.css';
import config from '../config';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      
      onLogin();
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <h2>Welcome!</h2>
      {error && <p className="login-error">{error}</p>}
      <input
        type="text"
        className="login-input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        className="login-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="login-submit">Login</button>
    </form>
  );
}

export default LoginForm;