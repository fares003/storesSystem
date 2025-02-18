import React, { useEffect, useState } from "react";
import Center from "./Center";
import { toast } from "react-toastify";
import axios from "axios";
import { z } from "zod";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API;

const itemSchema = z.object({
  cost: z.number().min(1, "Cost is required"),
  date: z.string().nullable().optional(),
  supplierid: z.string().min(1, "Supplier ID is required"),
  inventoryId: z.number().min(1, "Manager is required"),
  products: z.array(
    z.object({
      amount: z.number().min(1, "Quantity is required"),
      cost: z.number().min(1, "Cost is required"),
      productId: z.number().min(1, "Product ID is required"),
    })
  ).min(1, "At least one product is required"),
});

const AddNewShipment = () => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [managersData, setManagersData] = useState([]);
  const [formData, setFormData] = useState({
    cost: null,
    date: null,
    inventoryId: "",
    supplierid: "",
    products: [{ sku: "", amount: null, cost: null, productId: null }],
  });

  
const fetchItems = async () => {
  const target = `${API}item`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(target, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setItems(response.data);
    } else {
      console.error("Failed to fetch items.");
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    toast.error("Failed to fetch items. Please try again later.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

const fetchSuppliers = async () => {
  const target = `${API}InboundOrders/suppliers`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(target, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setSuppliers(response.data);
    } else {
      console.error("Failed to fetch suppliers.");
    }
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    toast.error("Failed to fetch suppliers. Please try again later.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};
const fetchManagersData = async()=>{
  const target = `${API}inventory`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(target, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setManagersData(response.data);
    } else {
      console.error("Failed to fetch ManagersData.");
    }
  } catch (error) {
    console.error("Error fetching ManagersData:", error);
    toast.error("Failed to fetch ManagersData. Please try again later.", {
      position: "top-right",
      autoClose: 3000,
    });
  }
}
useEffect(() => {
  fetchItems();
  fetchSuppliers();
  fetchManagersData() ;
}, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "cost" || name === "inventoryId" ? parseInt(value) || null : value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: name === "amount" || name === "cost" || name === "productId" ? parseFloat(value) || null : value,
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const addNewItem = () => {
    const lastItem = formData.products[formData.products.length - 1];
    if (
      lastItem.amount &&
      lastItem.cost &&
      lastItem.productId
    ) {
      setFormData((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          { sku: "", amount: null, cost: null, productId: null },
        ],
      }));
    } else {
      toast.error("Please fill all fields for the last product before adding a new one.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const RemoveItem = ()=>{
    if(formData.products.length > 1){
      const ProductsArrayAfterRemove = formData.products.slice(0 , formData.products.length - 1) ;
      setFormData((prev)=>({
        ... prev , 
        products : ProductsArrayAfterRemove
      }))
    }
  }
  const addShipment = async (e) => {
    e.preventDefault();
    try {
      const parsedData = itemSchema.parse(formData);
      const token = localStorage.getItem("token");
      const target = `${API}InboundOrders/create`;

      const response = await axios.post(target, parsedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("inbounded added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          cost: null,
          date: null,
          inventoryId:"" , 
          supplierid: "",
          products: [{ sku: "", amount: null, cost: null, productId: null }],
        });
      } else {
        toast.error("Error adding shipment", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error("Error adding shipment:", error);
        toast.error("Unexpected error occurred", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <Center className="bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <motion.div
        className="w-full max-w-6xl overflow-y-auto pb-4 scrollbar-track-slate-500 scrollbar-thumb-slate-800 scrollbar-thin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.form
          onSubmit={addShipment}
          className="bg-gray-800 rounded-xl p-6 shadow-2xl"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
            Create New Shipment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Cost */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Cost</label>
              <input
                type="number"
                name="cost"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.cost || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>

            {/* Supplier */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Supplier</label>
              <select
                name="supplierid"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.supplierid}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Supplier</option>
                {suppliers.map((ele) => (
                  <option key={ele.id} value={ele.id}>{ele.name}</option>
                ))}
              </select>
            </div>

            {/* Inventory Manager */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300">Inventory Manager</label>
              <select
                name="inventoryId"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white
                  focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.inventoryId}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Manager</option>
                {managersData.map((ele) => (
                  <option key={ele.id} value={ele.id}>{ele.manager}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-gray-200">Products</h3>
            
            {formData.products.map((item, i) => (
              <div key={i} className="bg-gray-700 p-4 rounded-lg flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Product Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-300">Product</label>
                    <select
                      name="productId"
                      className="w-full px-4 py-3 bg-gray-600 rounded-lg text-white
                        focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      value={item.productId || ""}
                      onChange={(e) => handleItemChange(i, e)}
                    >
                      <option value="" disabled>Select Product</option>
                      {items.map((ele) => (
                        <option key={ele.id} value={ele.id}>{ele.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-300">Quantity</label>
                    <input
                      type="number"
                      name="amount"
                      className="w-full px-4 py-3 bg-gray-600 rounded-lg text-white
                        focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      value={item.amount || ""}
                      onChange={(e) => handleItemChange(i, e)}
                    />
                  </div>

                  {/* Product Cost */}
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-300">Unit Cost</label>
                    <input
                      type="number"
                      name="cost"
                      className="w-full px-4 py-3 bg-gray-600 rounded-lg text-white
                        focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      value={item.cost || ""}
                      onChange={(e) => handleItemChange(i, e)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={addNewItem}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={RemoveItem}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Remove Product
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg
              text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Create Shipment
          </button>
        </motion.form>
      </motion.div>
    </Center>
  );
};

export default AddNewShipment;