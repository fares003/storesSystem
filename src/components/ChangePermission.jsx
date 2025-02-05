import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const ChangePermission = () => {
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API;
  const token = localStorage.getItem("token");

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}Authority`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles!');
    }
    setLoading(false);
  };

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}orders/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatuses(response.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      toast.error('Failed to fetch statuses!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
    fetchStatuses();
  }, []);

  const updatePermission = async (roleId, statusId, type, action) => {
    try {
      const endpoint = type === 'edit' ? 'orders/update-perm/create' : 'orders/view-perm/create';
      const response = await axios.post(
        `${API}${endpoint}`,
        { roleId, statusId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          `${action === 1 ? 'Enabled' : 'Disabled'} ${type === 'edit' ? 'Edit' : 'View'} permission for status ${statusId}!`
        );
      }
    } catch (error) {
      console.error(`Error updating ${type} permission:`, error);
      toast.error(`Failed to update ${type} permission!`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-500 min-h-screen p-4 md:p-8">
      <motion.div
        className="container mx-auto max-w-4xl bg-white p-8 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6">Manage Permissions</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">Update Permissions</h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:space-x-4">
                <select
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-md w-full mb-4 md:mb-0"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>

                <select
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-md w-full"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display buttons only if both role and status are selected */}
            {selectedRole && selectedStatus && (
              <div className="flex flex-wrap gap-4 justify-center mt-6">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition w-full sm:w-auto"
                  onClick={() => updatePermission(selectedRole, selectedStatus, 'edit', 1)}
                >
                  Enable Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition w-full sm:w-auto"
                  onClick={() => updatePermission(selectedRole, selectedStatus, 'edit', 0)}
                >
                  Disable Edit
                </button>
                <button
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition w-full sm:w-auto"
                  onClick={() => updatePermission(selectedRole, selectedStatus, 'view', 1)}
                >
                  Enable View
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition w-full sm:w-auto"
                  onClick={() => updatePermission(selectedRole, selectedStatus, 'view', 0)}
                >
                  Disable View
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChangePermission;
