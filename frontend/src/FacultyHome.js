// FacultyHome.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FacultyHome.css';

function FacultyHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const faculty = location.state?.facultyData;

  if (!faculty) return <div>No faculty data found</div>;

  const handleChangePassword = () => {
    navigate('/faculty-reset-password', {
      state: { eid: faculty.EID },
    });
  };

  return (
    <div className="faculty-home-container">
      <h2>Welcome, {faculty.FIRSTNAME}</h2>
      <div className="button-group">
        <button
          onClick={() =>
            navigate('/faculty-dashboard/${faculty.EID}', {
              state: { facultyData: faculty },
            })
          }
        >
          View Details
        </button>
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
}

export default FacultyHome;
