import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API;
const token = localStorage.getItem("token")
const InboundFinancial = () => {
  const [inboundFinancial, setInboundFinancial] = useState([]);
  const [PayPopup , setPayPopup] = useState(null) ;
  const [ PayPopupData , setPayPopupData] = useState({}) ;

  const fetchInboundFinancial = async () => {
    try {
      const target = API + "financial/inbound";
      const resp = await fetch(target);
      const data = await resp.json();
      setInboundFinancial(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handlePay = async (id, amount) => {
    try {
      const response = await fetch(`${API}financial/inbound/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, amount }),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // جلب تفاصيل الخطأ من السيرفر
        throw new Error(errorData.message || 'Payment failed');
      }
  
      toast.success("Payment successful");
      fetchInboundFinancial();
      setPayPopup(false)
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };
  
  useEffect(() => {
    fetchInboundFinancial();
  }, [inboundFinancial]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Inbound Financial</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inboundFinancial.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.supplier}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.totalCost}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.paid}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.remaining}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <ul className="space-y-2">
                    {order.products.map((product) => (
                      <li key={product.id} className="text-gray-700">
                        <span className="font-medium">{product.product}</span> (Delivered: {product.delivered}, Remaining: {product.remaining}, Total: {product.total})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                        setPayPopup( true); 
                        setPayPopupData({id : order.id });
                    }}
                    disabled={order.remaining === 0}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      order.remaining === 0
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } transition-colors`}
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {PayPopup && (
        <Popup
            title="Complete Order"
            onClose={() => setPayPopup(null)}
            actions={[
            {
                label: "Cancel",
                onClick: () => setPayPopup(null),
                type: "secondary",
            },
            {
                label: "Save",
                onClick : ()=>{handlePay(PayPopupData.id , PayPopupData.amount)},
                type: "primary",
            },
            ]}
        >
            <div className="flex flex-col gap-4">
            <div>
                <label>amount :</label>
                <input
                type="number"
                value={PayPopupData.amount}
                onChange={(e) =>
                    setPayPopupData({
                    ...PayPopupData,
                    amount: parseInt(e.target.value),
                    })
                }
                className="w-full p-2 border rounded-md"
                />
            </div>
            </div>
        </Popup>
        )}
    </div>
  );
};

export default InboundFinancial;