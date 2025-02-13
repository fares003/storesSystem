import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import { z } from "zod";
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API;

const itemSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required"),
  phonenumber: z
    .string()
    .min(1, "Phone number is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  address: z
    .string()
    .min(1, "Address is required"),
  items: z
    .array(
      z.object({
        sku: z
          .string()
          .min(1, "SKU is required"),
        quantity: z
          .string()
          .min(1, "Quantity is required"),
      })
    )
    .nonempty("Items array cannot be empty"),
});

const AddNewOrder = () => {
  const [formData, setFormData] = useState({
    username: "",
    phonenumber: "",
    email: "",
    address: "",
    items: [
      {
        sku: "",
        quantity: "",
      },
    ],
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}Item`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, items: updatedItems };
    });
  };

  const addNewItem = () => {
    if (formData.items[formData.items.length - 1].sku !== "" && formData.items[formData.items.length - 1].quantity !== "") {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, { sku: "", quantity: "" }],
      }));
    }
  };

  const removeItem = (i) => {
    if (formData.items.length > 1) {
      const FilteredItems = [];
      formData.items.forEach((element, index) => {
        index !== i && FilteredItems.push(element);
      });
      setFormData((prev) => ({
        ...prev,
        items: FilteredItems,
      }));
    }
  };

  const addOrder = async (e) => {
    e.preventDefault();
    try {
      const parsedData = itemSchema.parse(formData);

      const DataToBeSent = {
        customer: {
          username: parsedData.username,
          phonenumber: parsedData.phonenumber,
          email: parsedData.email,
        },
        default_address : {
          address1: parsedData.address,
        },
        line_Items: parsedData.items,
      };

      const token = localStorage.getItem("token");
      const target = `${API}orders/create`;

      const response = await axios.post(target, DataToBeSent, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        toast.success("Order added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          username: "",
          phonenumber: "",
          email: "",
          address: "",
          items: [{ sku: "", quantity: "" }],
        });
      } else {
        toast.error("Error adding item", {
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
        console.error("Error adding order :", error);
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
        className="flex flex-col gap-4 items-center w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="textGradient text-5xl md:text-6xl font-semibold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Add Order
        </motion.h2>
        <motion.form
          onSubmit={addOrder}
          className="grid grid-cols-12 w-[90%] md:w-[50%] gap-y-8 gap-x-4 items-center border shadow-lg shadow-slate-500 border-white rounded-2xl mx-6 md:mx-0 px-4 md:px-8 py-6 max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="col-span-6 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Username</label>
            <input
              name="username"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.username}
              onChange={handleInputChange}
            />
          </motion.div>

          <motion.div
            className="col-span-6 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Phone Number</label>
            <input
              name="phonenumber"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.phonenumber}
              onChange={handleInputChange}
            />
          </motion.div>

          <motion.div
            className="col-span-6 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Email</label>
            <input
              name="email"
              type="email"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.email}
              onChange={handleInputChange}
            />
          </motion.div>

          <motion.div
            className="col-span-6 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Address</label>
            <input
              name="address"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.address}
              onChange={handleInputChange}
            />
          </motion.div>

          {formData.items.map((item, i) => (
            <React.Fragment key={i}>
              <motion.div
                className={`col-span-5 flex flex-col gap-2 `}
                whileHover={{ scale: 1.05 }}
              >
                <label className="text-white text-lg">SKU</label>
                <select
                  name="sku"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.sku}
                  onChange={(e) => handleItemChange(i, e)}
                >
                  <option className="text-black" value="">Select SKU</option>
                  {items.map((item) => (
                    <option className="text-black" key={item.sku} value={item.sku}>
                      {item.sku} - {item.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                className={`col-span-5 flex flex-col gap-2 `}
                whileHover={{ scale: 1.05 }}
              >
                <label className="text-white text-lg">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </motion.div>

              <motion.div
                className={`col-span-2 flex flex-col gap-2 justify-center `}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white text-lg">actions</span>
                <div className='flex items-center gap-1 md:gap-4'>
                  <button
                    type="button"
                    className="w-full bg-green-600 py-1 rounded-md text-white text-2xl font-bold"
                    onClick={addNewItem}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="w-full bg-red-600 py-1 rounded-md text-white text-2xl font-bold"
                    onClick={() => { removeItem(i) }}
                  >
                    -
                  </button>
                </div>
              </motion.div>
            </React.Fragment>
          ))}

          <motion.div
            className="col-span-12 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <button
              type="submit"
              className="text-white px-6 py-2 rounded-lg bg-[#4C5365] hover:bg-[#5A6172] gradient-btn duration-300"
            >
              Submit
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </Center>
  );
};

export default AddNewOrder;