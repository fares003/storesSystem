import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAreYouSure } from '@/contexts/AreYouSure';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API;

const EmployeePayments = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}Employee?month=${month}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEmployees(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [month, token]);

  const handlePay = async (employeeId, amount) => {
    try {
      await axios.post(`${API}Employee/pay`, {
        employeeId,
        amount,
        forMonth: month
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Payment processed successfully")
    } catch (err) {
        toast.error("Payment failed")
        console.log("Payment failed" , err);
        
    }
  };

  const {setAreYouSurePopup}= useAreYouSure() ;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-200">Employee Payments</h1>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upselling</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.completedOrders}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.range}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">EGP {employee.baseSalary.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">EGP {employee.commission.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  EGP {employee.upsellingAmount.toLocaleString()} ({employee.upsellingOrders} orders)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">EGP {employee.total.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => {
                        setAreYouSurePopup({
                            open:true ,
                            actions : ()=>{
                                handlePay(employee.employeeId, employee.total)
                            }
                        })
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default EmployeePayments;

