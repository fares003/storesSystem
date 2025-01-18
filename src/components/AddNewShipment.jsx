import React, { useState } from "react";
import Center from "./Center";
import { toast } from "react-toastify";
import axios from "axios";
import { z } from "zod";

const API = import.meta.env.VITE_API;

const itemSchema = z.object({
  cost: z.number().min(1, "Cost is required"),
  date: z.string().min(1, "Date is required"),
  products: z
    .array(
      z.object({
        sku: z.string().min(1, "SKU is required"),
        amount: z.number().min(1, "Quantity is required"),
        cost: z.number().min(1, "Cost is required"),
      })
    )
    .nonempty("Products array cannot be empty"),
});

const AddNewShipment = () => {
  const [formData, setFormData] = useState({
    cost: null,
    date: "",
    products: [
      {
        sku: "",
        amount: null,
        cost: null,
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" ? parseFloat(value) || null : value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: name === "amount" || name === "cost" ? parseFloat(value) || null : value,
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const addNewItem = () => {
    const lastItem = formData.products[formData.products.length - 1];
    if (lastItem.sku && lastItem.amount && lastItem.cost) {
      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, { sku: "", amount: null, cost: null }],
      }));
    } else {
      toast.error("Please fill the last product before adding a new one.", {
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
      const target = `${API}storage/add-shipment`;

      const response = await axios.post(target, parsedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Shipment added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          cost: null,
          date: "",
          products: [{ sku: "", amount: null, cost: null }],
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
      <div className="flex flex-col gap-4 items-center w-full">
        <h2 className="textGradient text-5xl md:text-6xl font-semibold text-white">
          Add Shipment
        </h2>
        <form
          onSubmit={addShipment}
          className="grid grid-cols-12 w-[90%] md:w-[50%] gap-y-8 gap-x-4 items-center border shadow-lg shadow-slate-500 border-white rounded-2xl mx-6 md:mx-0 px-4 md:px-8 py-6 max-h-[50vh] overflow-y-auto"
        >
          <div className="col-span-6 flex flex-col gap-2">
            <label className="text-white text-lg">Cost</label>
            <input
              type="number"
              name="cost"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.cost || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-6 flex flex-col gap-2">
            <label className="text-white text-lg">Date</label>
            <input
              type="date"
              name="date"
              className="p-2 rounded-md bg-transparent border text-white"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

          {formData.products.map((item, i) => (
            <React.Fragment key={i}>
              <div className="col-span-4 flex flex-col gap-2">
                <label className="text-white text-lg">SKU</label>
                <input
                  name="sku"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.sku}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </div>

              <div className="col-span-4 flex flex-col gap-2">
                <label className="text-white text-lg">Quantity</label>
                <input
                  type="number"
                  name="amount"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.amount || ""}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </div>

              <div className="col-span-4 flex flex-col gap-2">
                <label className="text-white text-lg">Cost</label>
                <input
                  type="number"
                  name="cost"
                  className="p-2 rounded-md bg-transparent border text-white"
                  value={item.cost || ""}
                  onChange={(e) => handleItemChange(i, e)}
                />
              </div>
            </React.Fragment>
          ))}

          <div className="col-span-12 flex items-center justify-center gap-4">
            <button
              type="submit"
              className="text-white px-6 py-2 rounded-lg bg-[#4C5365] hover:bg-[#5A6172] gradient-btn duration-300"
            >
              Submit
            </button>

            <button
              type="button"
              className="text-white text-2xl font-semibold px-6 py-1 rounded-lg bg-green-600 hover:bg-green-800 gradient-btn duration-300"
              onClick={addNewItem}
            >
              +
            </button>
          </div>
        </form>
      </div>
    </Center>
  );
};

export default AddNewShipment;
