// frontend/src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './Login.css';

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        userId,
        password
      });

      if (response.data.success) {
        setMessage('✅ Login successful!');
        setTimeout(() => {
          navigate('/hr-dashboard'); // ✅ Redirect to HR dashboard
        }, 1000); // Add slight delay for user to see the message
      } else {
        setMessage('❌ Invalid credentials');
      }
    } catch (err) {
      setMessage('⚠️ Server error. Try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>HRMS Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
