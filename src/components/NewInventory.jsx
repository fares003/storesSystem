import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API;

const NewInventory = () => {
  const [formData, setFormData] = useState({
    name: '',
    managerId: '',
    address: '',
    phoneNum: '',
    costs: ''
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(`${API}Auth`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setManagers(response.data);
      } catch (err) {
        toast.error("Failed to load managers");
        setError('Failed to load managers list');
      } finally {
        setLoadingManagers(false);
      }
    };
    
    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}Inventory/create`, {
        ...formData,
        managerId: Number(formData.managerId),
        costs: Number(formData.costs)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Inventory created successfully!");
      setFormData({
        name: '',
        managerId: '',
        address: '',
        phoneNum: '',
        costs: ''
      });
    } catch (err) {
      toast.error("Failed to create inventory");
      setError('Failed to create inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Inventory</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager
            </label>
            <select
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingManagers}
            >
              <option value="">Select a Manager</option>
              {managers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.username}
                </option>
              ))}
            </select>
            {loadingManagers && (
              <p className="text-sm text-gray-500 mt-1">Loading managers...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costs
            </label>
            <input
              type="number"
              name="costs"
              value={formData.costs}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNum"
              value={formData.phoneNum}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Creating...' : 'Create Inventory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewInventory;