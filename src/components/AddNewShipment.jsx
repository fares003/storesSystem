import React, { useEffect, useState } from "react";
import Center from "./Center";
import { toast } from "react-toastify";
import axios from "axios";
import { z } from "zod";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API;

const itemSchema = z.object({
  cost: z.number().min(1, "Cost is required"),
  date: z.string().min(1, "Date is required"),
  supplierid: z.string().min(1, "Supplier ID is required"),
  products: z
    .array(
      z.object({
        sku: z.string().min(1, "SKU is required"),
        amount: z.number().min(1, "Quantity is required"),
        cost: z.number().min(1, "Cost is required"),
        productId: z.number().min(1, "Product ID is required"),
      })
    )
    .nonempty("Products array cannot be empty"),
});

const AddNewShipment = () => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    cost: null,
    date: "",
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

  useEffect(() => {
    fetchItems();
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" ? parseFloat(value) || null : value, // Only parse "cost" as a number
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
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
      lastItem.sku &&
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
          date: "",
          supplierid: "", // Reset to an empty string
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
    <Center>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 items-center w-full"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="textGradient text-5xl md:text-6xl font-semibold text-white"
        >
          Add inbound orders
        </motion.h2>
        <motion.form
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={addShipment}
          className="grid grid-cols-12 w-[90%] md:w-[60%] gap-y-8 gap-x-4 items-center border shadow-lg shadow-slate-500 border-white rounded-2xl mx-6 md:mx-0 px-4 md:px-8 py-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-800"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-6 flex flex-col gap-2"
          >
            <label className="text-white text-lg">Cost</label>
            <input
              type="number"
              name="cost"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.cost || ""}
              onChange={handleInputChange}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-6 flex flex-col gap-2"
          >
            <label className="text-white text-lg">Date</label>
            <input
              type="date"
              name="date"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.date}
              onChange={handleInputChange}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-12 flex flex-col gap-2"
          >
            <label className="text-white text-lg">Supplier</label>
            <select
              name="supplierid"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.supplierid}
              onChange={handleInputChange}
            >
              <option className="bg-slate-600" value="" disabled>
                Select a supplier
              </option>
              {suppliers.map((ele) => (
                <option className="bg-slate-600" key={ele.id} value={ele.id}>
                  {ele.name}
                </option>
              ))}
            </select>
          </motion.div>

          {formData.products.map((item, i) => (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                className="col-span-6 flex flex-col gap-2"
              >
                <label className="text-white text-lg">SKU</label>
                <input
                  name="sku"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.sku}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                className="col-span-6 flex flex-col gap-2"
              >
                <label className="text-white text-lg">Quantity</label>
                <input
                  type="number"
                  name="amount"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.amount || ""}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                className="col-span-6 flex flex-col gap-2"
              >
                <label className="text-white text-lg">Cost</label>
                <input
                  type="number"
                  name="cost"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.cost || ""}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                className="col-span-6 flex flex-col gap-2"
              >
                <label className="text-white text-lg">Product ID</label>
                <select
                  name="productId"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.productId || ""}
                  onChange={(e) => handleItemChange(i, e)}
                >
                  <option className="bg-slate-600" value="" disabled>
                    Select a product
                  </option>
                  {items.map((ele) => (
                    <option className="bg-slate-600" key={ele.id} value={ele.id}>
                      {ele.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            </React.Fragment>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="col-span-12 flex items-center justify-center gap-4"
          >
            <button
              type="submit"
              className="text-white px-6 py-2 rounded-lg bg-[#4C5365] hover:bg-[#5A6172] gradient-btn duration-300"
            >
              Submit
            </button>

            <button
              type="button"
              aria-label="Add new product"
              className="text-white text-2xl font-semibold px-6 py-1 rounded-lg bg-green-600 hover:bg-green-800 gradient-btn duration-300"
              onClick={addNewItem}
            >
              +
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </Center>
  );
};

export default AddNewShipment;