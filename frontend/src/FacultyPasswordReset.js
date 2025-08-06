// frontend/src/FacultyResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // reuse styles

function FacultyResetPassword() {
  const [eid, setEid] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('❌ New passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/faculty-update-password', {
        eid,
        oldPassword,
        newPassword
      });

      if (response.data.success) {
        setMessage('✅ Password updated successfully');
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Server error. Try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Change Faculty Password</h2>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>Faculty ID (EID):</label>
          <input type="text" value={eid} onChange={(e) => setEid(e.target.value)} required />
        </div>
        <div>
          <label>Current Password:</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        </div>
        <div>
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit">Update Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default FacultyResetPassword;
