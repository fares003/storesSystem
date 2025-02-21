import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import Loader from "./Loader";

const API = import.meta.env.VITE_API;

const InventoryTransfer = () => {

  const [activeTab, setActiveTab] = useState('transfer');
  const [transferData, setTransferData] = useState({
    sourceId: '',
    destinationId: '',
    items: [],
  });
  const [requestData, setRequestData] = useState({
    requesterId: '',
    requesteeId: '',
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [inventoriesLoading, setInventoriesLoading] = useState(true);
  const [itemsList, setItemsList] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState({ id: '', quantity: '' });

  useEffect(() => {
    // Fetch items
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API}item`);
        setItemsList(response.data);
      } catch (error) {
        toast.error("Failed to load items");
        console.error(error);
      } finally {
        setItemsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addSelectedItem = (type) => {
    if (!selectedItem.id || !selectedItem.quantity || Number(selectedItem.quantity) <= 0) {
      toast.error("Please select an item and enter valid quantity");
      return;
    }

    const item = itemsList.find(i => i.id === Number(selectedItem.id));
    if (item.available < Number(selectedItem.quantity)) {
      toast.error(`Only ${item.available} items available`);
      return;
    }

    const newItem = {
      productId: selectedItem.id,
      quantity: selectedItem.quantity
    };

    if (type === 'transfer') {
      setTransferData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    } else {
      setRequestData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }
    setSelectedItem({ id: '', quantity: '' });
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const product = itemsList.find(p => p.id === Number(item.productId));
      return total + (product?.price || 0) * Number(item.quantity);
    }, 0);
  };

  
  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await axios.get(`${API}inventory`);
        setInventories(response.data);
      } catch (error) {
        toast.error("Failed to load inventories");
        console.error(error);
      } finally {
        setInventoriesLoading(false);
      }
    };
    fetchInventories();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        sourceId: Number(transferData.sourceId),
        destinationId: Number(transferData.destinationId),
        items: transferData.items.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        })),
        requestId: null
      };

      await axios.post(`${API}inventory/transfer`, payload);
      toast.success("Transfer completed successfully!");
      setTransferData({
        sourceId: '',
        destinationId: '',
        items: [{ productId: '', quantity: '' }],
      });
    } catch (error) {
      console.log(error);
      toast.error("Transfer failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        requesterId: Number(requestData.requesterId),
        requesteeId: Number(requestData.requesteeId),
        items: requestData.items.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        }))
      };

      await axios.post(`${API}inventory/transfer/request`, payload);
      toast.success("Transfer request sent successfully!");
      setRequestData({
        requesterId: '',
        requesteeId: '',
        items: [{ productId: '', quantity: '' }],
      });
    } catch (error) {
      toast.error("Request failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  
  const addItem = (type) => {
    if (type === 'transfer') {
      setTransferData(prev => ({
        ...prev,
        items: [...prev.items, { productId: '', quantity: '' }]
      }));
    } else {
      setRequestData(prev => ({
        ...prev,
        items: [...prev.items, { productId: '', quantity: '' }]
      }));
    }
  };

  const removeItem = (index, type) => {
    if (type === 'transfer') {
      setTransferData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    } else {
      setRequestData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const renderInventoryOptions = () => {
    if (inventoriesLoading) {
      return <option>Loading inventories...</option>;
    }
    return inventories.map((inventory) => (
      <option key={inventory.id} value={inventory.id}>
        {inventory.name || inventory.manager || `Inventory #${inventory.id}`}
      </option>
    ));
  };


  return (
    <Center>
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Items List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 h-fit lg:sticky lg:top-4"
        >
          <h2 className="text-xl font-bold mb-4 text-blue-600">Available Items</h2>
          
          {itemsLoading ? (
            <Loader size={30} />
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <select
                  value={selectedItem.id}
                  onChange={e => setSelectedItem({...selectedItem, id: e.target.value})}
                  className="flex-1 p-2 border rounded-lg"
                >
                  <option value="">Select Item</option>
                  {itemsList.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Available: {item.available})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={selectedItem.quantity}
                  onChange={e => setSelectedItem({...selectedItem, quantity: e.target.value})}
                  className="w-20 p-2 border rounded-lg"
                />
                <button
                  onClick={() => addSelectedItem(activeTab)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Current {activeTab === 'transfer' ? 'Transfer' : 'Request'} Items</h3>
                <div className="space-y-2">
                  {(activeTab === 'transfer' ? transferData.items : requestData.items)
                    .filter(item => item.productId)
                    .map((item, index) => {
                      const product = itemsList.find(p => p.id === Number(item.productId));
                      return (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <div>
                            <span className="font-medium">{product?.name}</span>
                            <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="text-blue-600">
                            ${(product?.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      ${calculateTotal(activeTab === 'transfer' ? transferData.items : requestData.items).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Transfer/Request Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6"
        >
                      <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('transfer')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'transfer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Direct Transfer
                </button>
                <button
                    onClick={() => setActiveTab('request')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'request'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Request Transfer
                </button>
            </div>

            {activeTab === 'transfer' ? (
            <motion.form
                onSubmit={handleTransfer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
            >
                <div className="grid md:grid-cols-2 gap-4">
                <select
                    value={transferData.sourceId}
                    onChange={e => setTransferData({ ...transferData, sourceId: e.target.value })}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={inventoriesLoading}
                >
                    <option value="">Select Source Inventory</option>
                    {renderInventoryOptions()}
                </select>
                <select
                    value={transferData.destinationId}
                    onChange={e => setTransferData({ ...transferData, destinationId: e.target.value })}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={inventoriesLoading}
                >
                    <option value="">Select Destination Inventory</option>
                    {renderInventoryOptions()}
                </select>
                </div>

                <div className="space-y-4">
                {transferData.items.map((item, index) => (
                    <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 items-center"
                    >
                    <input
                        type="number"
                        placeholder="Product ID"
                        required
                        value={item.productId}
                        onChange={e => {
                        const newItems = [...transferData.items];
                        newItems[index].productId = e.target.value;
                        setTransferData({ ...transferData, items: newItems });
                        }}
                        className="flex-1 p-2 border rounded-lg"
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        required
                        value={item.quantity}
                        onChange={e => {
                        const newItems = [...transferData.items];
                        newItems[index].quantity = e.target.value;
                        setTransferData({ ...transferData, items: newItems });
                        }}
                        className="flex-1 p-2 border rounded-lg"
                    />
                    {transferData.items.length > 1 && (
                        <button
                        type="button"
                        onClick={() => removeItem(index, 'transfer')}
                        className="text-red-500 hover:text-red-700"
                        >
                        ×
                        </button>
                    )}
                    </motion.div>
                ))}
                <button
                    type="button"
                    onClick={() => addItem('transfer')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    + Add Item
                </button>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? <Loader size={20} /> : 'Process Transfer'}
                </button>
            </motion.form>
            ) : (
            <motion.form
                onSubmit={handleRequest}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
            >
                <div className="grid md:grid-cols-2 gap-4">
                <select
                    value={requestData.requesterId}
                    onChange={e => setRequestData({ ...requestData, requesterId: e.target.value })}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={inventoriesLoading}
                >
                    <option value="">Select Requester Inventory</option>
                    {renderInventoryOptions()}
                </select>
                <select
                    value={requestData.requesteeId}
                    onChange={e => setRequestData({ ...requestData, requesteeId: e.target.value })}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={inventoriesLoading}
                >
                    <option value="">Select Requestee Inventory</option>
                    {renderInventoryOptions()}
                </select>
                </div>

                <div className="space-y-4">
                {requestData.items.map((item, index) => (
                    <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 items-center"
                    >
                    <input
                        type="number"
                        placeholder="Product ID"
                        required
                        value={item.productId}
                        onChange={e => {
                        const newItems = [...requestData.items];
                        newItems[index].productId = e.target.value;
                        setRequestData({ ...requestData, items: newItems });
                        }}
                        className="flex-1 p-2 border rounded-lg"
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        required
                        value={item.quantity}
                        onChange={e => {
                        const newItems = [...requestData.items];
                        newItems[index].quantity = e.target.value;
                        setRequestData({ ...requestData, items: newItems });
                        }}
                        className="flex-1 p-2 border rounded-lg"
                    />
                    {requestData.items.length > 1 && (
                        <button
                        type="button"
                        onClick={() => removeItem(index, 'request')}
                        className="text-red-500 hover:text-red-700"
                        >
                        ×
                        </button>
                    )}
                    </motion.div>
                ))}
                <button
                    type="button"
                    onClick={() => addItem('request')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    + Add Item
                </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? <Loader size={20} /> : 'Submit Request'}
                </button>
            </motion.form>
            )}
        </motion.div>
      </div>
    </Center>
  );
};

export default InventoryTransfer;