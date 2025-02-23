import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API;

const SupplierDetailes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supplierId, setSupplierId] = useState('');
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [createSupplierName , setCreateSupplierName] = useState("") ;
  const [createSupplierAddress , setCreateSupplierAddress] = useState("") ;
  const [createSupplierContacts , setCreateSupplierContacts] = useState("") ;

  const fetchAllsuppliers = async () => {
    try {
      const response = await axios.get(`${API}InboundOrders/suppliers`);
      setAllSuppliers(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data. Please try again.');
    }
  };

  useEffect(() => {
    fetchAllsuppliers();
  }, []);

  const fetchData = async () => {
    if (!supplierId) {
      setError('Please select a valid supplier.');
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
    }finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };
  const HandleCreateSupplier = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API}InboundOrders/suppliers/create`,
        { 
          name: createSupplierName,
          address: createSupplierAddress,
          contacts: createSupplierContacts
         },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreateSupplierName("")
      toast.success("Supplier created!");
    } catch (err) {
      console.error("Error creating supplier:", err);
      toast.error(err.response?.data?.message || err.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Supplier</h1>
          <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-2">
            Create Supplier:
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text"
              name="supplierName"
              id="supplierName"
              placeholder='name'
              value={createSupplierName}
              onChange={(e)=>{setCreateSupplierName(e.target.value)}}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text"
              name="supplierAddress"
              id="supplierAddress"
              placeholder='Address'
              value={createSupplierAddress}
              onChange={(e)=>{setCreateSupplierAddress(e.target.value)}}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text"
              name="supplierContacts"
              id="supplierContacts"
              placeholder='Contacts'
              value={createSupplierContacts}
              onChange={(e)=>{setCreateSupplierContacts(e.target.value)}}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={HandleCreateSupplier}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >Create</button>
          </div>
      </div>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Supplier Details</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-2">
            Select Supplier:
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              id="supplierId"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a supplier</option>
              {allSuppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
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