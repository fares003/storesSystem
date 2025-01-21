import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [authorities, setAuthorities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API;
  const token = localStorage.getItem("token");

  const fetchAuthorities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}Authority`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuthorities(response.data);
    } catch (error) {
      console.error('Error fetching authorities:', error);
      toast.error('Failed to fetch roles!');
    }
    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API}Auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let emps = []
      console.log(response.data);
      response.data.forEach(emp => {
        emps.push(emp.username);
      });
      
      setEmployees(emps);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees!');
    }
  };

  useEffect(() => {
    fetchAuthorities();
    fetchEmployees();
  }, []);

  const createRole = async () => {
    if (!newRole.trim()) {
      toast.warning('Role name cannot be empty!');
      return;
    }

    try {
      const response = await axios.post(
        `${API}Authority/create`,
        { name: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success('Role created successfully!');
        setNewRole('');
        fetchAuthorities();
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role!');
    }
  };

  const assignRoleToEmployee = async () => {
    if (!selectedEmpId || !selectedRoleId) {
      toast.warning('Please select an employee and a role!');
      return;
    }

    try {
      const response = await axios.post(
        `${API}Authority/authorize`,
        { empId: selectedEmpId, roleId: selectedRoleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Role assigned to employee successfully!');
        setSelectedEmpId('');
        setSelectedRoleId('');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role!');
    }
  };

  const deleteRole = async (id) => {
    try {
      await axios.delete(`${API}Authority/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Role deleted successfully!');
      fetchAuthorities();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role!');
    }
  };

  // const updatePermissions = async () => {
  //   try {
  //     const response = await axios.get(`${API}Authority/update-perms`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       toast.success('Permissions updated successfully!');
  //     }
  //   } catch (error) {
  //     console.error('Error updating permissions:', error);
  //     toast.error('Failed to update permissions!');
  //   }
  // };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl text-center text-white font-bold mb-8">
        Admin Panel
      </h1>
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl text-white mb-4">Manage Roles</h2>
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <ul className="mb-4">
            {authorities.map((role) => (
              <motion.li
                key={role.id}
                className="flex justify-between items-center text-white bg-gray-700 p-2 rounded-md mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span>{role.name}</span>
                <button
                  className="bg-red-600 px-4 py-1 rounded-md text-white hover:bg-red-500 transition"
                  onClick={() => deleteRole(role.id)}
                >
                  Delete
                </button>
              </motion.li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="New Role Name"
            className="flex-1 p-2 border rounded-md"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <button
            className="bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-500 transition"
            onClick={createRole}
          >
            Add Role
          </button>
        </div>

        {/* Assign Role to Employee */}
        <div className="mt-8">
          <h3 className="text-xl text-white mb-4">Assign Role to Employee</h3>
          <div className="flex gap-4">
            <select
              className="flex-1 p-2 border rounded-md"
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
            >
              <option value="">Select Employee</option>
              {
              employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
            <select
              className="flex-1 p-2 border rounded-md"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              <option value="">Select Role</option>
              {authorities.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button
              className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-500 transition"
              onClick={assignRoleToEmployee}
            >
              Assign Role
            </button>
          </div>
        </div>

        {/* <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-500 transition"
            onClick={updatePermissions}
          >
            Update Permissions
          </button>
        </div> */}
      </motion.div>
    </div>
  );
};

export default AdminPanel;
