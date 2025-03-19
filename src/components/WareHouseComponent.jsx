import React, { useState } from "react";
import { FiCheck, FiX, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function WareHouseComponent() {
  const [order, setOrder] = useState({ cart: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [barcodeValidation, setBarcodeValidation] = useState([]);
  const [barcodeCounts, setBarcodeCounts] = useState({});
  const [searchError, setSearchError] = useState("");
  const [orderId, setOrderId] = useState("");
  const API = import.meta.env.VITE_API;

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const target = API + "OutboundOrders/by-barcode";

      const resp = await axios.post(
        target,
        { barcode: searchTerm },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = resp.data;
      setOrder(data);
      setOrderId(data.id);
      setBarcodes(Array(data.cart.reduce((sum, item) => sum + item.quantity, 0)).fill(""));
      setBarcodeValidation(Array(data.cart.reduce((sum, item) => sum + item.quantity, 0)).fill(null));
      setBarcodeCounts(data.cart.reduce((acc, item) => {
        acc[item.name] = 0;
        return acc;
      }, {}));
      setSearchError(""); // Clear any previous error
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSearchError("Order not found. Please check the barcode and try again.");
        toast.error("Order not found. Please check the barcode and try again.");

      } else {
        console.error("Error fetching orders:", error);
        setSearchError("An unexpected error occurred. Please try again later.");
        toast.error(searchError);
        toast.error("Order not found. Please check the barcode and try again.");
      }
    }
  };

  const handleBarcodeChange = (index, value) => {
    const newBarcodes = [...barcodes];
    newBarcodes[index] = value;
    setBarcodes(newBarcodes);
  };

  const handleCheckBarcode = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const target = API + `OutboundOrders/barcode/${barcodes[index]}`;
  
      const resp = await axios.get(
        target,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const validName = resp.data.name;
      const matchingItem = order.cart.find((item) => item.name === validName);
  
      const newValidation = [...barcodeValidation];
      const newCounts = { ...barcodeCounts };
  
      if (matchingItem) {
        newValidation[index] = "valid";
  
        // Increment count for this item
        newCounts[validName] = (newCounts[validName] || 0) + 1;
      } else {
        newValidation[index] = "invalid";
      }
  
      setBarcodeValidation(newValidation);
      setBarcodeCounts(newCounts);
    } catch (error) {
      const newValidation = [...barcodeValidation];
      newValidation[index] = "invalid";
      setBarcodeValidation(newValidation);
    }
  };
  
  const isItemCountValid = (itemName, requiredQuantity) => {
    return barcodeCounts[itemName] === requiredQuantity;
  };
const handlePrepairOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    const target = API + `OutboundOrders/prepare`;
    const resp = await axios.post(
      target,
      {
        orderId: orderId,
        barcodes: barcodes,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Order prepared successfully!");
  } catch (error) {
    console.error("Error preparing order:", error);
    toast.error("An unexpected error occurred. Please try again later.");
  }
};
  return (
    <div className="w-full h-screen flex items-start justify-center mt-8 text-white">
      <div className="w-full max-w-4xl overflow-y-auto scrollbar-thin mx-10">
        {/* Title */}
        <div className="flex flex-col items-center text-white mb-8">
          <h1 className="text-5xl font-extrabold dark:text-white">
            Warehouse Management
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center space-x-4 w-fit pb-4 border-b border-white">
            <input
              type="text"
              placeholder="Enter order barcode here..."
              className="px-4 py-2 w-80 bg-gray-700 text-white rounded-md outline-none placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-6 py-2 bg-white text-black font-semibold rounded-md shadow-md hover:bg-gray-200"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Display Items and Barcode Inputs */}
        <div className="mt-6 flex flex-col items-center rounded-lg  w-full">
          {order.cart.map((item, itemIndex) => (
            <div key={itemIndex} className="mb-4 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-3">{item.name} ({barcodeCounts[item.name] || 0}/{item.quantity})</h2>
              
              <div className="w-full flex flex-col items-center space-y-3">
                {Array.from({ length: item.quantity }, (_, index) => {
                  const globalIndex = order.cart.slice(0, itemIndex).reduce((sum, prevItem) => sum + prevItem.quantity, 0) + index;

                  return (
                    <div key={globalIndex} className="relative w-80 flex items-center">
                      <input
                        type="text"
                        placeholder={`Barcode ${index + 1}`}
                        className={`px-4 py-2 w-full bg-white text-black outline-none placeholder-gray-800 rounded-md transition-all 
                          ${barcodeValidation[globalIndex] === "invalid" ? "border-red-400 shadow-red-400/50 border-2 shadow-lg" : ""}
                          ${barcodeValidation[globalIndex] === "valid" ? "border-green-500 shadow-green-500/50 border-2 shadow-lg" : ""}
                        `}
                        value={barcodes[globalIndex]}
                        onChange={(e) => handleBarcodeChange(globalIndex, e.target.value)}
                        onBlur={() => handleCheckBarcode(globalIndex)}
                      />
                      {barcodeValidation[globalIndex] === "valid" && (
                        <FiCheck className="absolute right-3 text-green-500 text-xl" />
                      )}
                      {barcodeValidation[globalIndex] === "invalid" && (
                        <FiX className="absolute right-3 text-red-500 text-xl" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Display Warning if Count is Incorrect */}
              {!isItemCountValid(item.name, item.quantity) && (
                <div className="flex items-center mt-2 text-yellow-500">
                  <FiAlertTriangle className="mr-2" />
                  <span>Incorrect barcode count for {item.name}!</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {order.cart.length > 0 &&
        <motion.div
          whileHover={barcodes.every((barcode, index) => barcode !== "" && barcodeValidation[index] === "valid") ? { scale: 1.05 } : {}}
          whileTap={barcodes.every((barcode, index) => barcode !== "" && barcodeValidation[index] === "valid") ? { scale: 0.95 } : {}}
        >
          <button
            className="px-10 py-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
            disabled={barcodes.some((barcode) => barcode === "" || barcodeValidation.includes("invalid"))}
          >
            Prepare Order
          </button>
        </motion.div>
          }
        </div>
      </div>
    </div>
  );
}

export default WareHouseComponent;
