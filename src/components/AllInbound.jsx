import React, { useState, useEffect } from 'react';
import Center from './Center';
import { toast } from 'react-toastify';
import axios from 'axios';
import Barcode from 'react-barcode';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AllInbound = () => {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API;
  const [storage, setStorage] = useState([]);
  
  const fetchStorage = async () => {
    try {
      const target = `${API}InboundOrders`;
      const resp = await fetch(target);
      const data = await resp.json();
      setStorage(data);
    } catch (error) {
      console.error("Error fetching inbound Orders :", error);
      toast.error("Error fetching inbound Orders data");
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStorage = storage.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(storage.length / itemsPerPage);
    
    // Number of pagination buttons to display at a time
    const maxPaginationButtons = 5;

    // Calculate the range of pagination buttons to display
    const getPaginationRange = () => {
      const halfRange = Math.floor(maxPaginationButtons / 2);
      let start = Math.max(currentPage - halfRange, 1);
      let end = Math.min(start + maxPaginationButtons - 1, totalPages);

      if (end - start + 1 < maxPaginationButtons) {
        start = Math.max(end - maxPaginationButtons + 1, 1);
      }

      return { start, end };
    };

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const { start, end } = getPaginationRange();

    
  return (
    <Center className={"mt-2"}>
      <div className="flex flex-col items-center gap-6 w-full px-2 overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300">
        <h2 className="textGradient text-4xl font-bold text-white">Storage List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {currentStorage.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="bg-gray-800 text-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-semibold text-gray-400">Storage ID:</span> {item.id}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Date:</span> {item.date}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Total Cost:</span> {item.cost}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">supplier:</span> EGP{item.supplier}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">status:</span> EGP{item.status}
                </div>
              </div>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                onClick={()=>{navigate("/Shipment", { state: { shipmentId: item.id} })}}
              >
                previrew
              </button>
              {/* <div>
                <h3 className="font-semibold text-lg">Products:</h3>
                <ul className="list-disc pl-6 text-sm text-gray-300">
                  {item.products.map((product, j) => (
                    <li key={j}>
                      Product ID: {product.productId} - Quantity: {product.amount} - ${product.costPerPiece}
                      <div className="flex justify-center my-2 z-10">
                        <Barcode
                          value={product.barcode}
                          format="CODE128"
                          width={1}
                          height={50}
                          displayValue={true}
                          fontSize={14}
                          background="#f9f9f9"
                          lineColor="#000"
                        />
                      </div>
                      
                    </li>
                  ))}
                </ul>
              </div> */}
            </motion.div>
          ))}
        </div>
        
          {/* totalPages */}
          <div className="flex justify-center items-center gap-2 mt-6">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            Previous
          </button>

          {/* Pagination Buttons */}
          {Array.from({ length: end - start + 1 }, (_, index) => start + index).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </Center>
  );
};

export default AllInbound;
