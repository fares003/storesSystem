import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";


const API = import.meta.env.VITE_API;

const AssignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [barcode, setBarcode] = useState("");

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
      toast.success("Order completed successfully");
    } catch (err) {
      toast.error("Failed to complete the order");
      setError(err.message);
    }
  };

  const handleDispatchClick = (orderId) => {
    setCurrentOrderId(orderId);
    setShowDispatchModal(true);
    setBarcode("");
  };

  const handleDispatchSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    if (!barcode.trim()) {
      toast.error("Please enter a barcode");
      return;
    }

    try {
      const response = await axios.post(
        `${API}Shipping/dispatch-local`,
        { barcode: barcode },
        {
          headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to dispatch the order");
      }

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== currentOrderId));
      setShowDispatchModal(false);
      toast.success("Order dispatched successfully");
    } catch (err) {
      toast.error("Failed to dispatch the order");
      setError(err.message);
    }
  };
const handleCancelOrder = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    setError("No token found. Please log in.");
    return;
  }

  try {
    const response = await axios.delete(`${API}Orders/cancel/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  

    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    toast.success("Order canceled successfully");
  } catch (err) {
    toast.error("Failed to cancel the order");
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
      <div className="max-w-8xl mx-auto">
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
                  
                  <div className="flex items-center space-x-4">
                    {order.status === "ready for shipping" && (
                      <button
                        onClick={() => handleDispatchClick(order.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                      >
                        Dispatch
                      </button>
                    )}
                    {order.status === "in transit" && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                      >
                        Mark as Completed
                      </button>
                    )}
                    <button className={`px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors duration-300${order.status === "cancel" ? "cursor-not-allowed" : ""}`} disabled={order.status === "cancel"} onClick={() => handleCancelOrder(order.id)}>
                      Cancel
                    </button>
                  </div>
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

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Dispatch Order #{currentOrderId}
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Barcode</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter barcode"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Dispatch
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;