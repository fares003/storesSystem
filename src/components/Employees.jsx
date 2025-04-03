import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
const API = import.meta.env.VITE_API;

function Employees() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEmployees = async () => {
      const target = `${API}Auth/read-employees`;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(target, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setEmployees(response.data);
        } else {
          console.error("Failed to fetch employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    getEmployees();
  }, []);

  const handleActivate = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to activate this employee",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, activate!',
      cancelButtonText: 'Cancel'
    });
  
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API}Auth/activate/`,
          { employeeId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.status === 200) {
          const updatedEmployees = employees.map(employee => 
            employee.id === id ? { ...employee, isActive: true } : employee
          );
          setEmployees(updatedEmployees);
          
          Swal.fire(
            'Activated!',
            'Employee has been activated.',
            'success'
          );
        } else {
          throw new Error('Failed to activate employee');
        }
      } catch (error) {
        console.error("Error activating employee:", error);
        Swal.fire(
          'Error!',
          error.response?.data?.message || 'Failed to activate employee',
          'error'
        );
      }
    }
  };

  const handleRowClick = (id) => {
    navigate(`/employees/info/${id}`);
  };

  return (
    <div className="text-white p-5 bg-[#1E293B] rounded-md m-5 shadow-lg">
      <h2 className="text-xl font-bold text-center text-[#FACC15] mb-4">
        Employees List
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 bg-[#0F172A] text-left border-collapse text-[#E2E8F0]">
          <thead className="bg-[#334155] text-white">
            <tr className="border-b-2 border-gray-700">
              <th className="p-3 text-md font-bold text-center">ID</th>
              <th className="p-3 text-md font-bold text-center">Name</th>
              <th className="p-3 text-md font-bold text-center">Email</th>
              <th className="p-3 text-md font-bold text-center">Phone</th>
              <th className="p-3 text-md font-bold text-center">Store</th>
              <th className="p-3 text-md font-bold text-center">Salary</th>
              <th className="p-3 text-md font-bold text-center">Roles</th>
              <th className="p-3 text-md font-bold text-center">Active</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border border-gray-600 hover:bg-[#1E293B] transition duration-300 cursor-pointer"
                  onClick={() => handleRowClick(employee.id)}
                >
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {employee.id}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {employee.name}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {employee.email}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {employee.phoneNumber || "N/A"}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {employee.store}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {employee.salary}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {employee.roles ? employee.roles.join(", ") : "N/A"}
                  </td>
                  <td className="p-2 text-sm border border-gray-700 text-center">
                    {employee.isActive ? (
                      <span className="px-3 py-1 text-green-600 bg-green-100 rounded-full font-semibold">
                        Activated
                      </span>
                    ) : (
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(employee.id);
                        }}
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-400">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;