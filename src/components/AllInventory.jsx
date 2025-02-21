import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import Loader from "./Loader";

const API = import.meta.env.VITE_API;

const AllInventory = () => {
  const [transfers, setTransfers] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventories();
    fetchTransfers();
  }, []);

  useEffect(() => {
    fetchTransfers(selectedInventory);
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

  const fetchTransfers = async (inventoryId = "") => {
    setLoading(true);
    try {
      const url = inventoryId ? `${API}inventory/transfer/${inventoryId}` : `${API}inventory/transfer`;
      const response = await axios.get(url);
      setTransfers(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch transfers");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceive = async (transferId) => {
    try {
      await axios.put(`${API}inventory/transfer/confirm-receive/${transferId}`);
      toast.success("Transfer confirmed successfully!");
      setTransfers(transfers.map(transfer => 
        transfer.id === transferId ? { ...transfer, received: true, receivedAt: new Date().toISOString() } : transfer
      ));
    } catch (error) {
      console.log(error);
      toast.error("Failed to confirm transfer");
    }
  };

  return (
    <Center>
      <div className="w-full min-h-[90vh] overflow-y-auto max-w-8xl p-6 bg-slate-300">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Inventory Transfers</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Inventory:</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedInventory}
            onChange={(e) => setSelectedInventory(e.target.value)}
          >
            <option value="">All Inventories</option>
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
                  <th className="px-6 py-3 text-left text-sm font-medium">From</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">To</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Sent At</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Received At</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800">{transfer.source || `Location ${transfer.sourceId}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{transfer.destination || `Location ${transfer.destinationId}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {transfer.items.map((item) => (
                        <div key={item.productId} className="mb-1">
                          {item.product} (Qty: {item.quantity})
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(transfer.sentAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {transfer.receivedAt 
                        ? new Date(transfer.receivedAt).toLocaleString()
                        : 'Not received yet'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {transfer.received ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirmReceive(transfer.id)}
                          className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                        >
                          Confirm Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transfers.length === 0 && !loading && (
              <div className="text-gray-500 p-6 text-center">
                No inventory transfers found
              </div>
            )}
          </div>
        )}
      </div>
    </Center>
  );
};

export default AllInventory;
