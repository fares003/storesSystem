import React, { useState } from "react";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function WareHouseComponent() {
  const [order, setOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodes, setBarcodes] = useState([]); // Store all items' barcodes
  const [barcodeValidation, setBarcodeValidation] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
      setCurrentItemIndex(0);

      // Initialize barcode storage for all items
      setBarcodes(data.cart.map((item) => new Array(item.quantity).fill("")));
      setBarcodeValidation(data.cart.map((item) => new Array(item.quantity).fill(null)));

      setShowModal(true);
    } catch (error) {
      toast.error("Order not found. Please check the barcode and try again.");
    }
  };

  const handleBarcodeChange = (itemIndex, barcodeIndex, value) => {
    setBarcodes((prev) => {
      const newBarcodes = [...prev];
      newBarcodes[itemIndex] = [...newBarcodes[itemIndex]];
      newBarcodes[itemIndex][barcodeIndex] = value;
      return newBarcodes;
    });

    if (value === "") {
      setBarcodeValidation((prev) => {
        const newValidation = [...prev];
        newValidation[itemIndex] = [...newValidation[itemIndex]];
        newValidation[itemIndex][barcodeIndex] = null;
        return newValidation;
      });
    }
  };

  const handleCheckBarcode = async (itemIndex, barcodeIndex, itemName) => {
    try {
      const currentBarcode = barcodes[itemIndex][barcodeIndex];
      
      if (currentBarcode === "") {
        setBarcodeValidation((prev) => {
          const newValidation = [...prev];
          newValidation[itemIndex] = [...newValidation[itemIndex]];
          newValidation[itemIndex][barcodeIndex] = null;
          return newValidation;
        });
        return; // Exit early if the input is empty
      }
  
      // Check if this barcode exists in any other position (excluding itself)
      const barcodeExistsElsewhere = barcodes.some((itemBarcodes, i) => 
        i !== itemIndex && itemBarcodes.includes(currentBarcode)
      );
  
      if (barcodeExistsElsewhere) {
        setBarcodeValidation((prev) => {
          const newValidation = [...prev];
          newValidation[itemIndex] = [...newValidation[itemIndex]];
          newValidation[itemIndex][barcodeIndex] = "invalid";
          return newValidation;
        });
        toast.error("Barcode already exists in another item.");
        return;
      }
  
      const token = localStorage.getItem("token");
      const target = API + `OutboundOrders/barcode/${currentBarcode}`;
      const resp = await axios.get(target, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const validName = resp.data.name;
      setBarcodeValidation((prev) => {
        const newValidation = [...prev];
        newValidation[itemIndex] = [...newValidation[itemIndex]];
        newValidation[itemIndex][barcodeIndex] = validName === itemName ? "valid" : "invalid";
        return newValidation;
      });
    } catch (error) {
      setBarcodeValidation((prev) => {
        const newValidation = [...prev];
        newValidation[itemIndex] = [...newValidation[itemIndex]];
        newValidation[itemIndex][barcodeIndex] = "invalid";
        return newValidation;
      });
    }
  };
  const handleNextItem = () => {
    if (currentItemIndex < order.cart.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
    } else {
      setShowModal(false);
      toast.success("All items verified! Ready to prepare order.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrepareOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const target = API + `OutboundOrders/prepare`;

      // Collect all barcodes from all items
      const formattedBarcodes = barcodes.flatMap((itemBarcodes) =>
        itemBarcodes.map((barcode) => ({ barcode }))
      );

      const payload = { orderId: order.id, barcodes: formattedBarcodes };

      await axios.post(target, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      toast.success("Order prepared successfully!");
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("The order has already been prepared.");
      } else {
        toast.error("An error occurred while preparing the order.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center text-white">
      <div className="w-full max-w-xl mx-6">
        <h1 className="text-4xl font-bold text-center mb-6">Warehouse Management</h1>

        <div className="flex space-x-4 items-center justify-center">
          <input
            type="text"
            placeholder="Enter order barcode..."
            className="px-4 py-2 w-80 bg-gray-700 text-white rounded-md outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {showModal && order && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg"
          >
            <h2 className="text-xl font-semibold mb-3">
              {order.cart[currentItemIndex].name}
            </h2>

            <div className="space-y-3">
              {barcodes[currentItemIndex]?.map((barcode, barcodeIndex) => (
                <div key={barcodeIndex} className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder={`Barcode ${barcodeIndex + 1}`}
                    className={`px-4 py-2 w-full bg-gray-700 text-white rounded-md ${
                      barcodeValidation[currentItemIndex]?.[barcodeIndex] === "invalid"
                        ? "border-red-500"
                        : barcodeValidation[currentItemIndex]?.[barcodeIndex] === "valid"
                        ? "border-green-500"
                        : ""
                    }`}
                    value={barcode}
                    onChange={(e) => handleBarcodeChange(currentItemIndex, barcodeIndex, e.target.value)}
                    onBlur={() => handleCheckBarcode(currentItemIndex, barcodeIndex, order.cart[currentItemIndex].name)}
                  />
                  {barcodeValidation[currentItemIndex]?.[barcodeIndex] === "valid" && (
                    <AiFillCheckCircle className="text-green-500 text-xl" />
                  )}
                  {barcodeValidation[currentItemIndex]?.[barcodeIndex] === "invalid" && (
                    <AiOutlineCloseCircle className="text-red-500 text-xl" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button className="px-6 py-2 bg-gray-500 text-white rounded-md" onClick={handleCloseModal}>
                Close
              </button>
              {currentItemIndex < order.cart.length - 1 ? (
                <button
                  className={`px-6 py-2 rounded-md ${
                    barcodes[currentItemIndex]?.some((barcode) => barcode === "") ||
                    barcodeValidation[currentItemIndex]?.some((validation) => validation !== "valid")
                      ? "bg-blue-300 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={handleNextItem}
                  disabled={
                    barcodes[currentItemIndex]?.some((barcode) => barcode === "") ||
                    barcodeValidation[currentItemIndex]?.some((validation) => validation !== "valid")
                  }
                >
                  Next Item
                </button>
              ) : (
                <button
                  className={`px-6 py-2 rounded-md ${
                    barcodes[currentItemIndex]?.some((barcode) => barcode === "") ||
                    barcodeValidation[currentItemIndex]?.some((validation) => validation !== "valid")
                      ? "bg-green-300 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-white"
                  }`}
                  onClick={handlePrepareOrder}
                  disabled={
                    barcodes[currentItemIndex]?.some((barcode) => barcode === "") ||
                    barcodeValidation[currentItemIndex]?.some((validation) => validation !== "valid")
                  }
                >
                  Prepare Order
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default WareHouseComponent;
