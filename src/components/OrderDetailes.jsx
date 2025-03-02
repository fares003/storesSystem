import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const API = import.meta.env.VITE_API;

const OrderDetailes = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [orderData, setOrderData] = useState();
  const [orderHestory, setOrderHestory] = useState([]);
  console.log(orderHestory);
  
  const fetchOrder = async () => {
    const target = `${API}orders/${orderId}`;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOrderData(response.data);
      } else {
        console.error("Failed to fetch order.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  const fetchHestory = async ()=>{
    const target = `${API}orders/summary/${orderId}`;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOrderHestory(response.data);
      } else {
        console.error("Failed to fetch order.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }
  const fetchInvoice = async () => {
    try {
      const response = await axios.get(`${API}Orders/invoice/${orderId}`, {
        responseType: 'blob',
      });
      
      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.log('Error fetching invoice:', error);
    }
  };
    useEffect(() => {
    fetchOrder();
    fetchHestory() ; 
  }, []);

  if (!orderData) {
    return <div className="min-h-screen bg-gray-100 p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-8xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <h1 className="text-3xl font-bold text-indigo-500 mb-6">Order Details</h1>
          <button className="px-6 py-2 bg-orange-500 rounded-md text-white font-semibold" onClick={fetchInvoice} >invoice</button>
        </div>

        {/* General Order Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-500 mb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Order ID</p>
              <p className="text-lg font-medium text-blue-800">{orderData.id}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Order Time</p>
              <p className="text-lg font-medium text-blue-800">
                {new Date(orderData.orderTime).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Status</p>
              <p className="text-lg font-medium text-blue-800">{orderData.status}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Total</p>
              <p className="text-lg font-medium text-blue-800">${orderData.total}</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 mt-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-500">Order Hestory</p>
            {
              <ul className="text-lg font-medium text-blue-800 mt-4">
                {orderHestory.map((element, index) => {
                  const match = element.event.match(/Order became (\w+) at (.+)/);
                  const eventType = match ? match[1] : element.event;
                  const eventDate = match ? match[2] : '';

                  return (
                    <li key={index}>
                      Order became
                      <span className={`${eventType.toLowerCase() == "Delivered".toLowerCase() ? "text-orange-500" :
                        eventType.toLowerCase() == "Cancelled".toLowerCase() ? "text-red-500" : 
                        (eventType.toLowerCase() == "Complete".toLowerCase() || eventType.toLowerCase() == "Confirmed".toLowerCase() )? "text-green-500" :
                        eventType.toLowerCase() == "in transit (quickconnect)".toLowerCase() ? "text-blue-500" : "text-black" 
                       }
                          font-bold`}>
                            {eventType}
                          </span> at 
                      <span className="text-blue-700 font-bold"> {eventDate}</span>
                    </li>
                  );
                })}
              </ul>
            }
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-indigo-500 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-500">Customer Name</p>
              <p className="text-lg font-medium text-indigo-800">{orderData.customer.name|| "N/A"}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-500">Email</p>
              <p className="text-lg font-medium text-indigo-800">{orderData.customer.email|| "N/A"}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-500">Phone Number</p>
              <p className="text-lg font-medium text-indigo-800">
                {orderData.customer.phoneNumber || "N/A"}
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-sm text-indigo-500">Address</p>
              <p className="text-lg font-medium text-indigo-800">
                {orderData.customer.address || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div>
          <h2 className="text-xl font-semibold text-indigo-500 mb-4">Cart Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {orderData.cart.map((item, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-indigo-800">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">{item.price} EGP</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">
                      {item.quantity * item.price} EGP 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailes;