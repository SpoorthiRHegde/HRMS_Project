import React, { useState, useEffect } from "react";
import axios from "axios";
import './LeaveAssign.css';

export default function AssignLeave() {
    const [employees, setEmployees] = useState([]);
    const [leaveData, setLeaveData] = useState({});
    const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEmployees();
        fetchLeaveData();
    }, [fiscalYear]);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/get-employees");
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
            alert("Error fetching employees");
        }
    };

    const fetchLeaveData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/get-leave-data?year=${fiscalYear}`);
            setLeaveData(res.data);
        } catch (err) {
            console.error("Error fetching leave data:", err);
        }
    };

    const handleChange = (EID, type, value) => {
        setLeaveData(prev => ({
            ...prev,
            [EID]: { ...prev[EID], [type]: value }
        }));
    };

    const handleAssign = async (EID) => {
        try {
            await axios.post("http://localhost:5000/assign-leave", {
                EID,
                fiscal_year: fiscalYear,
                leaveData: leaveData[EID]
            });
            alert("Leave assigned successfully");
            setEditingId(null);
            fetchLeaveData();
        } catch (err) {
            console.error(err);
            alert("Error assigning leave");
        }
    };

    const leaveTypes = [
        'LEAVE_EL', 'LEAVE_CL', 'LEAVE_VL', 
        'LEAVE_SCL', 'LEAVE_RH', 'LEAVE_OOD', 
        'LEAVE_OTHER', 'LEAVE_COMPOFF'
    ];

    return (
        <div className="leave-assign-container">
            <h2>Assign Leave</h2>
            <div className="fiscal-year">
                <label>Fiscal Year: </label>
                <input
                    type="number"
                    value={fiscalYear}
                    onChange={e => setFiscalYear(e.target.value)}
                />
            </div>

            <table className="leave-table">
                <thead>
                    <tr>
                        <th>Employee</th>
                        {leaveTypes.map(type => (
                            <th key={type}>{type.replace('LEAVE_', '')}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.EID}>
                            <td>{emp.FIRSTNAME} {emp.LASTNAME}</td>
                            {leaveTypes.map(type => (
                                <td key={type}>
                                    {editingId === emp.EID ? (
                                        <input
                                            type="number"
                                            min="0"
                                            value={leaveData[emp.EID]?.[type] || ''}
                                            onChange={e => handleChange(emp.EID, type, e.target.value)}
                                        />
                                    ) : (
                                        leaveData[emp.EID]?.[type] ? leaveData[emp.EID][type] : <span className="empty-cell">-</span>
                                    )}
                                </td>
                            ))}
                            <td>
                                {editingId === emp.EID ? (
                                    <>
                                        <button class="save-btn" onClick={() => handleAssign(emp.EID)}>Save</button>
                                        <button class="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <button class="edit-btn" onClick={() => setEditingId(emp.EID)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}