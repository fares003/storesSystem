import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function RefundCopmonent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [item, setItem] = useState();
  const API = import.meta.env.VITE_API;
  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  const handleSearch = async() => {
    try {
      const target = API + `OutboundOrders/barcode/${searchQuery}`;
      const response = await axios.get(target,  {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      })
      if (response.status === 200) {
         
          setItem(response.data);
          setShowAddCompanyModal(true);
          
      }
      else {
         toast.error('Failed to find barcode data data.')
      }

  } catch (error) {
    toast.error('Failed to find barcode data data.')
          
  }

  }
  return (
    <div className="w-full h-screen flex items-center justify-center text-white">
        <div className="w-full max-w-xl mx-6">
        <h1 className="text-4xl font-bold text-center mb-6">Enter the item to refund</h1>

        <div className="flex space-x-4 items-center justify-center">
          <input
            type="text"
            placeholder="Enter item barcode..."
            className="px-4 py-2 w-80 bg-gray-700 text-white rounded-md outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
              {/* Add Company Modal */}
              {showAddCompanyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1E293B] p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-[#FACC15] mb-4">Add New Company</h3>
                       
                    </div>
                </div>
            )}
    </div>
  )
}

export default RefundCopmonent