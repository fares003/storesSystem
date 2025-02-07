import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API;

const AssignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}Shipping/assigned-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch assigned orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedOrders();
  }, []);

  // Handle completing an order
  const handleCompleteOrder = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${API}Shipping/complete/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to complete the order");
      }

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      toast.success("Completed")
    } catch (err) {
        toast.error("Failed to complete the order")
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Assigned Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders assigned.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #{order.id}
                  </h2>
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Mark as Completed
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-700">Cart Items:</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    {order.cart.map((item, index) => (
                      <li key={index}>
                        {item.name} (x{item.quantity}) - EGP {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Total: <span className="text-green-600">EGP {order.total}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedOrders;