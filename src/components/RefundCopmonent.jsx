import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function RefundComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [item, setItem] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [reusable, setReusable] = useState(false);
  const API = import.meta.env.VITE_API;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const target = API + `Inventory/refund`;
      const response = await axios.post(target,{
        barcode: searchQuery,
        reason: refundReason,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.status === 200) {
        toast.success('Refund processed successfully!');
        setShowRefundModal(false);
        setSearchQuery('');
      }
 
    } catch (error) {
      toast.error('Failed to process refund');
      console.error(error);
    }
  }

  const handleSearch = async() => {
    try {
      const target = API + `OutboundOrders/barcode/${searchQuery}`;
      const response = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.status === 200) {
        setItem(response.data);
        setShowRefundModal(true);
      }
      else {
        toast.error('Failed to find barcode data.')
      }
    } catch (error) {
      toast.error('Failed to find barcode data.')
      console.error(error)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center text-white bg-gray-900 p-4">
      <div className="w-full max-w-xl mx-6 bg-gray-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-yellow-400">Process Refund</h1>
        <p className="text-center text-gray-300 mb-8">Enter the barcode of the item you want to refund</p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center justify-center">
          <input
            type="text"
            placeholder="Scan or enter item barcode..."
            className="px-6 py-3 w-full sm:w-80 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button 
            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      {showRefundModal && item && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-yellow-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-yellow-400">Confirm Refund</h3>
              <button 
                onClick={() => setShowRefundModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Item Name</p>
                <p className="text-lg font-semibold">{item.name}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Item ID</p>
                <p className="text-lg font-semibold">{item.id}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <label htmlFor="reason" className="text-sm text-gray-400 mb-1 block">Refund Reason</label>
                <input
                  id="reason"
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  required
                  
                />
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={reusable}
                    onChange={(e) => setReusable(e.target.checked)}
                    className="w-4 h-4 text-yellow-500 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-400">Item is reusable</span>
                </label>
                </div>
              
              
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-semibold"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RefundComponent;