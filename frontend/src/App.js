import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import HRDashboard from './components/HRDashboard';
import AddEmployee from './components/AddEmployee';
import ViewEmployees from './components/ViewEmployees';
import AddDepartment from './components/AddDepartment';
import ViewDepartments from './components/ViewDepartments';
import FacultyPasswordReset from './FacultyPasswordReset';
import FacultyDashboard from './FacultyDashboard';
import FacultyHome from './FacultyHome';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/view-employees" element={<ViewEmployees />} />
        <Route path="/add-department" element={<AddDepartment />} />
        <Route path="/view-departments" element={<ViewDepartments />} />
        <Route path="/faculty-reset-password" element={<FacultyPasswordReset />} />
        <Route path="/faculty-dashboard/:eid" element={<FacultyDashboard />} />
        <Route path="/faculty-home" element={<FacultyHome />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
