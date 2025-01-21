import Center from "@/components/Center";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { motion } from "framer-motion";

const itemSchema = z.object({
    name: z
      .string()
      .min(1, "Name is required"),
    price: z
      .union([z.number().positive(), z.string().refine((val) => !isNaN(parseFloat(val)), "Price is required and must be a valid number")])
      .transform((val) => parseFloat(val)),
    minimumAmount: z
      .union([z.number().positive(), z.string().refine((val) => !isNaN(parseFloat(val)), "minimumAmount is required and must be a valid number")])
      .transform((val) => parseFloat(val)),
    stock: z
      .union([z.number().int().nonnegative(), z.string().refine((val) => !isNaN(parseInt(val)), "Stock is required and must be a valid integer")])
      .transform((val) => parseInt(val)),
    sku: z
      .string()
      .min(1, "SKU is required"),
    description: z.string().optional(),
  });

function AddNewItem() {
  const API = import.meta.env.VITE_API;
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    minimumAmount: "",
    stock: "",
    sku: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = async (e) => {
    e.preventDefault();

    try {
      const parsedData = itemSchema.parse({
        name: formData.name,
        price: parseFloat(formData.price),
        minimumAmount: parseInt(formData.minimumAmount),
        stock: parseInt(formData.stock),
        sku: formData.sku,
        description: formData.description,
      });

      const token = localStorage.getItem("token");
      const target = `${API}item/create`;

      const response = await axios.post(target, parsedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        toast.success("Item added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          name: "",
          price: "",
          minimumAmount: "",
          stock: "",
          sku: "",
          description: "",
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
        console.error("Error adding item:", error);
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
          Add Item
        </motion.h2>
        <motion.form
          onSubmit={addItem}
          className="grid grid-cols-10 w-[90%] md:w-[50%] gap-4 items-center border shadow-lg shadow-slate-500 border-white rounded-2xl mx-6 md:mx-0 px-4 md:px-8 py-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="col-span-5 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Name</label>
            <input
              name="name"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.name}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div
            className="col-span-5 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Price</label>
            <input
              name="price"
              type="number"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.price}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div
            className="col-span-5 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Minimum Amout</label>
            <input
              name="minimumAmount"
              type="number"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.minimumAmount}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div
            className="col-span-5 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Stock</label>
            <input
              name="stock"
              type="number"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.stock}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div
            className="col-span-10 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">SKU</label>
            <input
              name="sku"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.sku}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div
            className="col-span-10 flex flex-col gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <label className="text-white text-lg">Description</label>
            <textarea
              name="description"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.description}
              onChange={handleInputChange}
            />
          </motion.div>
          <motion.div
            className="col-span-10 flex items-center justify-center"
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
}

export default AddNewItem;
