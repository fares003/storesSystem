import React, { useState } from 'react';

const API = import.meta.env.VITE_API;

const DeliverInbound = () => {
  const [barcode, setBarcode] = useState('');
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliverAmount, setDeliverAmount] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProductData(null);
    setSuccessMessage('');

    try {
      const response = await fetch(`${API}InboundOrders/fulfill/barcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(barcode),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }

      const data = await response.json();
      setProductData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeliverAmount = async () => {
    if (!productData) return;
  
    setError('');
    setSuccessMessage('');
  
    try {
      const payload = {
        id: productData.id,
        deliveredAmount: deliverAmount,
        isComplete: false,
      };
  
      const response = await fetch(`${API}InboundOrders/fulfill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const textResponse = await response.text();
  
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(textResponse);
      } catch (error) {
        jsonResponse = null;
      }
  
      if (!response.ok) {
        throw new Error(jsonResponse?.message || `Request failed with status ${response.status}: ${textResponse}`);
      }
  
      setProductData();
      setSuccessMessage('Amount delivered successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error delivering amount:", err);
      setError(err.message || "An unexpected error occurred.");
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">Deliver Inbound Order</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Barcode</label>
            <input
              type="text"
              id="barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter barcode"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {productData && (
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Product Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium text-blue-700">ID:</span> {productData.id}</p>
              <p><span className="font-medium text-blue-700">Name:</span> {productData.name}</p>
              <p><span className="font-medium text-blue-700">Total Amount:</span> {productData.totalAmount}</p>
              <p><span className="font-medium text-blue-700">Remaining Amount:</span> {productData.remainingAmount}</p>
              <p><span className="font-medium text-blue-700">Delivered Amount:</span> {productData.deliveredAmount}</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Deliver Amount
            </button>
          </div>
        )}

        {/* Modal for Deliver Amount */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Enter Deliver Amount</h2>
              <input
                type="number"
                value={deliverAmount}
                onChange={(e) => setDeliverAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                min="0"
                max={productData?.remainingAmount}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeliverAmount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverInbound;