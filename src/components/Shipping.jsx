import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API;

const Shipping = () => {
  const [localOrders, setLocalOrders] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchLocalOrders = async () => {
      try {
        const response = await fetch(`${API}Shipping/local-orders`);
        if (!response.ok) {
          throw new Error('Failed to fetch local orders');
        }
        const data = await response.json();
        setLocalOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLocalOrders();
  }, []);

  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const response = await fetch(`${API}Shipping/carriers`);
        if (!response.ok) {
          throw new Error('Failed to fetch carriers');
        }
        const data = await response.json();
        setCarriers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCarriers();
  }, []);

  const handleAssignCarrier = async (orderId) => {
    if (!selectedCarrier[orderId]) {
      setError('Please select a carrier for this order.');
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API}Shipping/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          carrierId: selectedCarrier[orderId],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign carrier');
      }

      setSuccessMessage(`Carrier assigned to order ${orderId} successfully!`);
      setSelectedCarrier((prev) => ({ ...prev, [orderId]: 0 }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-8xl">
        <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">Local Orders</h1>

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
              <tr className="bg-purple-600 text-white">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Cart Items</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Assign Carrier</th>
              </tr>
            </thead>
            <tbody>
              {localOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">
                    {order.cart.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {order.cart.map((item, index) => (
                          <li key={index}>
                            {item.name} - {item.quantity} x {item.price}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No items</span>
                    )}
                  </td>
                  <td className="p-3">{order.total}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedCarrier[order.id] || 0}
                        onChange={(e) =>
                          setSelectedCarrier((prev) => ({
                            ...prev,
                            [order.id]: Number(e.target.value),
                          }))
                        }
                        className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={0} disabled>Select Carrier</option>
                        {carriers.map((carrier) => (
                          <option key={carrier.id} value={carrier.id}>
                            {carrier.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignCarrier(order.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Assign
                      </button>
                    </div>
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

export default Shipping;