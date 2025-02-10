import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import { Select, Button, MenuItem, InputLabel, FormControl } from '@mui/material';
const API = import.meta.env.VITE_API;

const AllInventory = () => {
  const [selectedManager, setSelectedManager] = useState("");
  const [Authusers, setAuthusers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sourceInventory, setSourceInventory] = useState("");
  const [targetInventory, setTargetInventory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetchAuthusers();
    fetchProducts();
  }, []);

  const fetchAuthusers = async () => {
    const target = `${API}auth`;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAuthusers(response.data);
      } else {
        console.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProducts = async () => {
    const target = `${API}Item`;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setProducts(response.data);
      } else {
        console.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateInventory = async () => {
    const target = `${API}Inventory/create`;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        target,
        { managerId: selectedManager },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Inventory created successfully!');
        fetchAuthusers(); // Refresh the users list
      } else {
        toast.error('Failed to create inventory.');
      }
    } catch (error) {
      console.error('Error creating inventory:', error);
      toast.error('Error creating inventory. Please try again.');
    }
  };

  const handleTransferInventory = async () => {
    const target = `${API}Inventory/transfer`;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        target,
        {
          sourceId: sourceInventory,
          productId: selectedProduct,
          targetId: targetInventory,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Inventory transferred successfully!');
        // Reset form fields
        setSourceInventory("");
        setTargetInventory("");
        setSelectedProduct("");
        setQuantity("");
      } else {
        toast.error('Failed to transfer inventory.');
      }
    } catch (error) {
      console.error('Error transferring inventory:', error);
      toast.error('Error transferring inventory. Please try again.');
    }
  };

  return (
    <Center className={"px-5 bg-gray-200"}>
      <h2 className="textGradient text-4xl font-bold text-gray-900 mb-4">
        Inventory Management
      </h2>

      {/* Create Inventory Section */}
      <div className="w-full mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Create Inventory</h3>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <FormControl fullWidth>
            <InputLabel id="select-manager-label">Select Manager</InputLabel>
            <Select
              labelId="select-manager-label"
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              label="Select Manager"
            >
              {Authusers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateInventory}
            className="w-full md:w-auto"
          >
            Create Inventory
          </Button>
        </div>
      </div>

      {/* Transfer Inventory Section */}
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Transfer Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth>
            <InputLabel id="source-inventory-label">Source Inventory</InputLabel>
            <Select
              labelId="source-inventory-label"
              value={sourceInventory}
              onChange={(e) => setSourceInventory(e.target.value)}
              label="Source Inventory"
            >
              {Authusers.map((user) => (
                <MenuItem  key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="target-inventory-label">Target Inventory</InputLabel>
            <Select
              labelId="target-inventory-label"
              value={targetInventory}
              onChange={(e) => setTargetInventory(e.target.value)}
              label="Target Inventory"
            >
              {Authusers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              label="Product"
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="quantity-label">Quantity</InputLabel>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="Quantity"
            />
          </FormControl>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTransferInventory}
          className="mt-8 w-full"
        >
          Transfer Inventory
        </Button>
      </div>
    </Center>
  );
};

export default AllInventory;