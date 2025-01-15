import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListEmployeesApp from './ListEmployees'; // Path to ListEmployees.js
import UpdateEmployeeApp from './UpdateEmployee'; // Path to UpdateEmployee.js

export default function EmployeeApp() {
    return (
        <div className="EmployeeApp">
            <BrowserRouter>
                <Routes>
                    <Route path="/employees" element={<ListEmployeesApp />}></Route>
                    <Route path="/update" element={<UpdateEmployeeApp />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
