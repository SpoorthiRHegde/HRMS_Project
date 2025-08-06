// backend/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// HR login route
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM hrms_users WHERE user_id = ? AND password = ?',
      [userId, password]
    );
    if (rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Generate next available EID
app.get('/generate-eid', async (req, res) => {
  try {
    // Get all existing EIDs in order
    const [rows] = await pool.execute('SELECT EID FROM employee_master ORDER BY EID');
    
    // Find the first available gap starting from 1
    let expectedId = 1;
    for (const row of rows) {
      if (row.EID > expectedId) {
        // Found a gap, use expectedId
        break;
      }
      expectedId = row.EID + 1;
    }
    
    res.json({ eid: expectedId });
  } catch (err) {
    console.error('Error in /generate-eid:', err);
    res.status(500).json({ error: 'Failed to generate EID' });
  }
});

// Add employee with EID
app.post('/add-employee', async (req, res) => {
  const employeeData = req.body;
  try {
    const query = `INSERT INTO employee_master (
      EID, INITIAL, FIRSTNAME, MIDDLENAME, LASTNAME, DESIGNATION,
      DOB, DATE_OF_JOIN, FTYPE, NATIONALITY, PHONE, EMAIL, CASTE,
      DOORNO, CITY, STATE, PINCODE, GENDER, PROFEXP_DESIGNATION,
      PPROFEXP_FROM, PPROFEXP_TO, DID,
      BIOMETRIC_CARD_NO, AADHAR, BANK_ACC, PAN,
      INSTITUTION, PERCENTAGE, SPECIALIZATION, YOG,
      FNAME, F_DOB, MNAME, M_DOB, PASSWORD
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      employeeData.EID, employeeData.INITIAL, employeeData.FIRSTNAME, 
      employeeData.MIDDLENAME, employeeData.LASTNAME, employeeData.DESIGNATION,
      employeeData.DOB, employeeData.DATE_OF_JOIN, employeeData.FTYPE, 
      employeeData.NATIONALITY, employeeData.PHONE, employeeData.EMAIL, 
      employeeData.CASTE, employeeData.DOORNO, employeeData.CITY, 
      employeeData.STATE, employeeData.PINCODE, employeeData.GENDER, 
      employeeData.PROFEXP_DESIGNATION, employeeData.PPROFEXP_FROM, 
      employeeData.PPROFEXP_TO, employeeData.DID,
      employeeData.BIOMETRIC_CARD_NO, employeeData.AADHAR, 
      employeeData.BANK_ACC, employeeData.PAN,
      employeeData.INSTITUTION, employeeData.PERCENTAGE, 
      employeeData.SPECIALIZATION, employeeData.YOG,
      employeeData.FNAME, employeeData.F_DOB, employeeData.MNAME, 
      employeeData.M_DOB, employeeData.EID // Using EID as default password
    ];

    await pool.execute(query, values);
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ success: false, message: 'Failed to add employee' });
  }
});

// Add this to your index.js (backend)
app.get('/employee/:eid', async (req, res) => {
  const { eid } = req.params;
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM employee_master 
      WHERE EID = ?`, 
      [eid]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});
// Get all employees with all fields
app.get('/employees/full', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM employee_master
      ORDER BY EID
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error in /employees/full:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});
// View employees with search
app.get('/view-employees', async (req, res) => {
  const { q } = req.query;
  try {
    let query = `
      SELECT 
        EID, INITIAL, FIRSTNAME, MIDDLENAME, LASTNAME, 
        DESIGNATION, DOB, DATE_OF_JOIN, PHONE, EMAIL, 
        CITY, STATE, GENDER, DID
      FROM employee_master
    `;
    let params = [];
    
    if (q) {
      query += ' WHERE EID = ? OR FIRSTNAME LIKE ? OR LASTNAME LIKE ? OR EMAIL LIKE ?';
      params.push(q, `%${q}%`, `%${q}%`, `%${q}%`);
    }
    
    query += ' ORDER BY EID';
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error in /view-employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Delete employee
app.delete('/employee/:eid', async (req, res) => {
  const { eid } = req.params;
  try {
    await pool.execute('DELETE FROM employee_master WHERE EID = ?', [eid]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Update employee
app.put('/employee/:eid', async (req, res) => {
  const { eid } = req.params;
  const employeeData = req.body;
  
  try {
    // Build dynamic update query
    const fields = Object.keys(employeeData)
      .filter(key => key !== 'EID')
      .map(key => `${key} = ?`);
    
    const values = Object.values(employeeData)
      .filter((_, index) => Object.keys(employeeData)[index] !== 'EID');
    
    values.push(eid);
    
    await pool.execute(
      `UPDATE employee_master SET ${fields.join(', ')} WHERE EID = ?`,
      values
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Replace the existing /generate-did endpoint with this:
app.get('/generate-did', async (req, res) => {
  try {
    // Get all existing DIDs in order
    const [rows] = await pool.execute('SELECT DID FROM department ORDER BY DID');
    
    // Find the first available gap starting from 1
    let expectedId = 1;
    for (const row of rows) {
      if (row.DID > expectedId) {
        // Found a gap, use expectedId
        break;
      }
      expectedId = row.DID + 1;
    }
    
    res.json({ did: expectedId });
  } catch (err) {
    console.error('Error in /generate-did:', err);
    res.status(500).json({ error: 'Failed to generate DID' });
  }
});

// Add department with DID
app.post('/add-department', async (req, res) => {
  const { did, name } = req.body;
  try {
    await pool.execute('INSERT INTO department (DID, NAME) VALUES (?, ?)', [did, name]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to add department' });
  }
});

// View departments with optional filters
// Update this endpoint in backend/index.js
app.get('/view-departments', async (req, res) => {
  const { q } = req.query;
  try {
    let query = 'SELECT * FROM department';
    let params = [];
    
    if (q) {
      query += ' WHERE DID = ? OR NAME LIKE ?';
      params.push(q, `%${q}%`);
    }
    
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error in /view-departments:', err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Delete department
app.delete('/department/:did', async (req, res) => {
  const { did } = req.params;
  try {
    await pool.execute('DELETE FROM department WHERE DID = ?', [did]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Update department
app.put('/department/:did', async (req, res) => {
  const { did } = req.params;
  const { name } = req.body;
  try {
    await pool.execute('UPDATE department SET NAME = ? WHERE DID = ?', [name, did]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

app.listen(5000, () => {
  console.log('✅ Server running at http://localhost:5000');
});

// Faculty login route
app.post('/faculty-login', async (req, res) => {
  const { eid, password } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM employee_master WHERE EID = ? AND PASSWORD = ?',
      [eid, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, faculty: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Faculty login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Faculty Password Reset

app.post('/faculty-update-password', async (req, res) => {
  const { eid, oldPassword, newPassword } = req.body;

  try {
    const [rows] = await pool.execute('SELECT PASSWORD FROM employee_master WHERE EID = ?', [eid]);

    if (rows.length === 0) {
      return res.json({ success: false, message: 'Faculty not found' });
    }

    if (rows[0].PASSWORD !== oldPassword) {
      return res.json({ success: false, message: 'Incorrect current password' });
    }

    await pool.execute('UPDATE employee_master SET PASSWORD = ? WHERE EID = ?', [newPassword, eid]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// In server.js or routes file
app.post('/faculty-update-password', async (req, res) => {
  const { eid, oldPassword, newPassword } = req.body;

  try {
    const [rows] = await pool.execute('SELECT PASSWORD FROM employee_master WHERE EID = ?', [eid]);

    if (rows.length === 0) {
      return res.json({ success: false, message: 'Faculty not found' });
    }

    if (rows[0].PASSWORD !== oldPassword) {
      return res.json({ success: false, message: 'Incorrect current password' });
    }

    await pool.execute('UPDATE employee_master SET PASSWORD = ? WHERE EID = ?', [newPassword, eid]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// backend/index.js
app.post('/faculty-login', async (req, res) => {
  const { eid, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM employee_master WHERE EID = ? AND PASSWORD = ?', [eid, password]);

    if (rows.length > 0) {
      res.json({ success: true, faculty: rows[0] }); // Include faculty details
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false });
  }
});
