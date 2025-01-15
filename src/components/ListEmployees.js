import React, { useEffect, useState, useCallback } from "react";
import axios from 'axios';

export default function ListEmployeesApp() {
    const [employees, setEmployees] = useState([]);

    const getEmployees = useCallback(() => {
        console.log('Fetching Employees');
        axios.get('http://localhost:8080/employees')
            .then(response => onSuccess(response))
            .catch(error => onError(error))
            .finally(() => console.log('Finally done'));
    }, []);

    useEffect(() => {
        getEmployees();
    }, [getEmployees]);

    function onSuccess(response) {
        console.log(response);
        setEmployees(response.data);
    }

    function onError(error) {
        console.log(error);
    }

    return (
        <div className="EmployeeApp">
            <h1>Employees List</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
