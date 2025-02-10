import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API;

const Gov = () => {
    const deliveredID = 8 ;
    const cancelledAfterDeliveryID = 0 ;
    const cancelledBeforeDeliveryID = 0 ;
    
  const [shippingData, setShippingData] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({
    govId: 0,
    statusId: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}Gov/shipping`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setShippingData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  
  const handleEdit = (row) => {
    setEditingRow(row.governorateId);
    setFormData({
      govId: row.governorateId,
      statusId: 0,
      price: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API}Gov/shipping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      const updatedData = shippingData.map((item) => {
        if (item.governorateId === formData.govId) {
          return {
            ...item,
            delivered:
              formData.statusId === deliveredID ? formData.price : item.delivered,
            cancelledAfterDelivery:
              formData.statusId === cancelledAfterDeliveryID ? formData.price : item.cancelledAfterDelivery,
            cancelledBeforeDelivery:
              formData.statusId === cancelledBeforeDeliveryID ? formData.price : item.cancelledBeforeDelivery,
          };
        }
        return item;
      });
      setShippingData(updatedData);

      setSuccessMessage('Data updated successfully!');
      setEditingRow(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-8xl">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Governorate Shipping Data</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Governorate</th>
                <th className="p-3 text-left">Delivered</th>
                <th className="p-3 text-left">Cancelled After Delivery</th>
                <th className="p-3 text-left">Cancelled Before Delivery</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shippingData.map((row) => (
                <tr key={row.governorateId} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="p-3">{row.governorate}</td>
                  <td className="p-3">{row.delivered}</td>
                  <td className="p-3">{row.cancelledAfterDelivery}</td>
                  <td className="p-3">{row.cancelledBeforeDelivery}</td>
                  <td className="p-3">
                    {editingRow === row.governorateId ? (
                      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <select
                          name="statusId"
                          value={formData.statusId}
                          onChange={handleInputChange}
                          className="w-full sm:w-40 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value={0} disabled>Select Status</option>
                          <option value={deliveredID}>Delivered</option>
                          <option value={cancelledAfterDeliveryID}>Cancelled After Delivery</option>
                          <option value={cancelledBeforeDeliveryID}>Cancelled Before Delivery</option>
                        </select>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full sm:w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Price"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRow(null)}
                          className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => handleEdit(row)}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gov;