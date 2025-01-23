import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const ChangePermission = () => {
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
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
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl text-center text-white font-bold mb-8">
        Manage Permissions
      </h1>
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl text-white mb-4">Update Permissions for Roles</h2>
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <ul className="space-y-8">
            {roles.map((role) => (
              <motion.li
                key={role.id}
                className="bg-gray-700 p-4 rounded-md text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-4">{role.name}</h3>
                <div className="space-y-4">
                  {statuses.map((status) => (
                    <div
                      key={status.id}
                      className="flex justify-between items-center bg-gray-600 p-3 rounded-md"
                    >
                      <span>{status.name}</span>
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-500 transition"
                          onClick={() => updatePermission(role.id, status.id, 'edit', 1)}
                        >
                          Enable Edit
                        </button>
                        <button
                          className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-500 transition"
                          onClick={() => updatePermission(role.id, status.id, 'edit', 0)}
                        >
                          Disable Edit
                        </button>
                        <button
                          className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-500 transition"
                          onClick={() => updatePermission(role.id, status.id, 'view', 1)}
                        >
                          Enable View
                        </button>
                        <button
                          className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-500 transition"
                          onClick={() => updatePermission(role.id, status.id, 'view', 0)}
                        >
                          Disable View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default ChangePermission;
