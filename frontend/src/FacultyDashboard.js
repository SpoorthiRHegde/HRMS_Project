import React from 'react';
import { useLocation } from 'react-router-dom';
import './FacultyDashboard.css';

function FacultyDashboard() {
  const location = useLocation();
  const faculty = location.state?.facultyData;

  if (!faculty) return <div>No data found</div>;

  const sections = {
    'Basic Information': [
      'EID', 'INITIAL', 'FIRSTNAME', 'MIDDLENAME', 'LASTNAME', 'DESIGNATION', 'DID',
      'DOB', 'DATE_OF_JOIN', 'FTYPE', 'GENDER', 'PHONE', 'EMAIL', 'NATIONALITY', 'CASTE'
    ],
    'Address Information': ['DOORNO', 'CITY', 'STATE', 'PINCODE'],
    'Documents': ['AADHAR', 'BANK_ACC', 'PAN', 'BIOMETRIC_CARD_NO'],
    'Education': ['INSTITUTION', 'PERCENTAGE', 'SPECIALIZATION', 'YOG'],
    'Parents Info': ['FNAME', 'F_DOB', 'MNAME', 'M_DOB']
  };

  return (
    <div className="faculty-dashboard">
      <div className="dashboard-content">
        <h2 className="dashboard-title">Faculty Information</h2>
        {Object.entries(sections).map(([section, fields]) => (
          <div className="section-card" key={section}>
            <div className="section-title">{section}</div>
            <div className="form-grid">
              {fields.map((field) => (
                <div className="form-field" key={field}>
                  <label>{field.replace(/_/g, ' ')}</label>
                  <div className="field-value">{faculty[field] || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultyDashboard;
