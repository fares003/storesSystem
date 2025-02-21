import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import Loader from "./Loader";

const API = import.meta.env.VITE_API;

const AllTransferRequests = () => {
  const [requests, setRequests] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventories();
    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedInventory) {
      fetchInventoryRequests(selectedInventory);
    } else {
      fetchRequests();
    }
  }, [selectedInventory]);

  const fetchInventories = async () => {
    try {
      const response = await axios.get(`${API}inventory`);
      setInventories(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch inventories");
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}inventory/transfer/requests`);
      setRequests(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryRequests = async (inventoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}inventory/transfer/requests/${inventoryId}`);
      setRequests(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch inventory requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfillRequest = async (requestId) => {
    try {
      await axios.put(`${API}inventory/transfer/fulfill-request/${requestId}`);
      toast.success("Request fulfilled successfully!");
      // Refresh requests after fulfillment
      if (selectedInventory) {
        fetchInventoryRequests(selectedInventory);
      } else {
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fulfill request");
    }
  };

  return (
    <Center>
      <div className="w-full min-h-[90vh] overflow-y-auto max-w-8xl p-6 bg-slate-300">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Transfer Requests</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Inventory:</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedInventory}
            onChange={(e) => setSelectedInventory(e.target.value)}
          >
            <option value="">All Requests</option>
            {inventories.map((inventory) => (
              <option key={inventory.id} value={inventory.id}>
                {inventory.manager || `Inventory ${inventory.id}`}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-blue-600"><Loader/></div>
        ) : (
          <div className="bg-white rounded-lg shadow max-h-[80vh] overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Requester</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Requestee</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Requested At</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      {selectedInventory ? 
                        "No requests found for selected inventory" : 
                        "No transfer requests found"}
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {request.requester || `Inventory ${request.requesterId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {request.requestee || `Inventory ${request.requesteeId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {request.items.map((item) => (
                          <div key={item.productId} className="mb-1">
                            {item.product} (Qty: {item.quantity})
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {new Date(request.requestedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {request.fulfilled ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Fulfilled
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {!request.fulfilled && (
                          <button
                            onClick={() => handleFulfillRequest(request.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                            Fulfill
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Center>
  );
};

export default AllTransferRequests;