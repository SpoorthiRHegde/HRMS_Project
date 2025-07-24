import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import HRDashboard from './components/HRDashboard';
import AddEmployee from './components/AddEmployee';
import ViewEmployees from './components/ViewEmployees';
import AddDepartment from './components/AddDepartment';
import ViewDepartments from './components/ViewDepartments';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
