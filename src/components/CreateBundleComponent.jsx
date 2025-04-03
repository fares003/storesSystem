import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import { z } from "zod";
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API;

const bundleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  sku: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  items: z.array(
    z.object({
      productId: z.number().min(1, "Product ID is required"),
      sku: z.string().min(1, "SKU is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().min(0, "Price must be positive"), // Added item price
    })
  ).min(1, "At least one product is required"),
});

const CreateBundleComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: 0,
    items: [],
  });

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [itemPrices, setItemPrices] = useState({}); // State for individual item prices
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}Item`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
        // Initialize item prices with product prices
        const initialPrices = {};
        response.data.forEach(product => {
          initialPrices[product.sku] = product.price;
        });
        setItemPrices(initialPrices);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to load products");
      }
    };
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleQuantityChange = (sku, value) => {
    setQuantities(prev => ({
      ...prev,
      [sku]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const handleItemPriceChange = (sku, value) => {
    setItemPrices(prev => ({
      ...prev,
      [sku]: Math.max(0, parseFloat(value) || 0)
    }));
  };

  const addProductToBundle = (product) => {
    const quantity = quantities[product.sku] || 0;
    const price = itemPrices[product.sku] || product.price;
    
    if (quantity < 1) {
      toast.warning("Please enter a quantity greater than 0");
      return;
    }
  
    setFormData(prev => {
      const existingItemIndex = prev.items.findIndex(item => item.sku === product.sku);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { ...prev, items: updatedItems };
      } else {
        const newItem = {
          productId: product.id,
          sku: product.sku,
          quantity: quantity,
          price: price
        };
        return { 
          ...prev, 
          items: [...prev.items, newItem],
          price: prev.price + (price * quantity)
        };
      }
    });
  
    setQuantities(prev => ({ ...prev, [product.sku]: 0 }));
  };

  const removeItem = (sku) => {
    setFormData(prev => {
      const itemToRemove = prev.items.find(item => item.sku === sku);
      return {
        ...prev,
        items: prev.items.filter(item => item.sku !== sku),
        price: prev.price - (itemToRemove?.price * itemToRemove?.quantity || 0)
      };
    });
  };

  const calculateTotalPrice = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const createBundle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const bundleData = {
        ...formData,
        price: calculateTotalPrice(),
        items: formData.items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };

      bundleSchema.parse(bundleData);

      const token = localStorage.getItem("token");
      const response = await axios.post(`${API}Item/create-bundle`, bundleData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if ([200, 201].includes(response.status)) {
        toast.success("Bundle created successfully!");
        setFormData({
          name: "",
          description: "",
          sku: "",
          price: 0,
          items: [],
        });
        setQuantities({});
      }
    } catch (error) {
      console.error("Error creating bundle:", error);
      toast.error(error.response?.data?.message || "Failed to create bundle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Center className="bg-gradient-to-br from-gray-900 to-blue-900 p-6">
      <motion.div
        className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl h-[85vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Bundle Form */}
        <motion.form
          onSubmit={createBundle}
          className="lg:w-1/2 h-full flex flex-col bg-gray-800 rounded-xl p-6 shadow-2xl"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
            Create New Bundle
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-4">
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Bundle Name *</label>
              <input
                name="name"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Description *</label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">SKU (Optional)</label>
              <input
                name="sku"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Will be auto-generated if empty"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Bundle Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={calculateTotalPrice().toFixed(2)}
                readOnly
              />
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-lg font-semibold text-gray-200">Included Products</h3>
              {formData.items.length === 0 ? (
                <div className="bg-gray-700/50 rounded-lg p-4 text-center text-gray-400">
                  No products added yet
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.items.map((item) => {
                    const product = products.find(p => p.sku === item.sku);
                    const itemTotal = item.price * item.quantity;
                    return (
                      <div key={item.sku} className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-gray-200 font-medium">{product?.name}</p>
                            <p className="text-sm text-gray-400">SKU: {item.sku}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.sku)}
                            className="text-red-400 hover:text-red-300 px-2"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <label className="text-xs text-gray-400">Quantity</label>
                            <div className="text-sm">{item.quantity}</div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400">Unit Price</label>
                            <div className="text-sm">${item.price.toFixed(2)}</div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400">Total</label>
                            <div className="text-sm font-medium">${itemTotal.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 font-medium">Total Price:</span>
              <span className="text-xl font-bold text-white">
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || formData.items.length === 0}
              className={`w-full py-2 rounded-lg text-white font-medium transition-colors
                ${isSubmitting || formData.items.length === 0 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'}`}
            >
              {isSubmitting ? 'Creating...' : 'Create Bundle'}
            </button>
          </div>
        </motion.form>

        {/* Product Selection */}
        <motion.div
          className="lg:w-1/2 h-full bg-gray-800 rounded-xl p-6 shadow-2xl"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
        >
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Available Products</h3>
          <div className="h-[calc(100%-50px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => (
                <div key={product.sku} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-200 font-medium truncate">{product.name}</h4>
                      <div className="flex gap-2 text-xs text-gray-400 mt-1">
                        <span>SKU: {product.sku}</span>
                        <span>Stock: {product.quantity}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-400">Qty</label>
                          <input
                            type="number"
                            min="0"
                            max={product.quantity}
                            value={quantities[product.sku] || 0}
                            onChange={(e) => handleQuantityChange(product.sku, e.target.value)}
                            className="w-16 px-2 py-1 bg-gray-600 text-white rounded text-center"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-400">Price</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={itemPrices[product.sku] || product.price}
                            onChange={(e) => handleItemPriceChange(product.sku, e.target.value)}
                            className="w-20 px-2 py-1 bg-gray-600 text-white rounded text-center"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addProductToBundle(product)}
                        disabled={!quantities[product.sku] || quantities[product.sku] < 1}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded transition-colors
                          disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Add to Bundle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Center>
  );
};

export default CreateBundleComponent;