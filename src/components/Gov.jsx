import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API;

const GovShipping = () => {
  const [shippingData, setShippingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    govId: 0,
    delivered: null,
    cancelledAfterDelivery: null,
    cancelledBeforeDelivery: null
  });

  // Fetch shipping data
  const fetchShippingData = async () => {
    try {
      const response = await axios.get(`${API}Gov/shipping`);
      setShippingData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const handleEdit = (gov) => {
    setEditingId(gov.governorateId);
    setFormData({
      govId: gov.governorateId,
      delivered: gov.delivered || null,
      cancelledAfterDelivery: gov.cancelledAfterDelivery || null,
      cancelledBeforeDelivery: gov.cancelledBeforeDelivery || null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Prepare the request body exactly as your backend expects
      const requestBody = {
        govId: formData.govId,
        delivered: formData.delivered,
        cancelledAfterDelivery: formData.cancelledAfterDelivery,
        cancelledBeforeDelivery: formData.cancelledBeforeDelivery
      };

      const response = await axios.post(`${API}Gov/shipping`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to update shipping data');
      }

      // Refresh data after successful update
      await fetchShippingData();
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Cost Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Governorate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancelled After Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancelled Before Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shippingData.map((gov) => (
              <tr key={gov.governorateId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{gov.governorate}</td>
                
                {editingId === gov.governorateId ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="delivered"
                        value={formData.delivered}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="cancelledAfterDelivery"
                        value={formData.cancelledAfterDelivery}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        name="cancelledBeforeDelivery"
                        value={formData.cancelledBeforeDelivery}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">{gov.delivered || 0}</td>
                    <td className="px-6 py-4">{gov.cancelledAfterDelivery || 0}</td>
                    <td className="px-6 py-4">{gov.cancelledBeforeDelivery || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(gov)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GovShipping;