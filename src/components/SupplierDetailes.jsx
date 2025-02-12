import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API;

const SupplierDetailes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supplierId, setSupplierId] = useState('');

  const fetchData = async () => {
    if (!supplierId) {
      setError('Please enter a valid supplier ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API}InboundOrders/supplier/${supplierId}`);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data. Please try again.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Supplier Details</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Supplier ID:
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              id="supplierId"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 123"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Loading...' : 'Show Data'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Shipment Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Returned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.product}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {new Date(item.shipmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.sales}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.sold}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.returned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDetailes;