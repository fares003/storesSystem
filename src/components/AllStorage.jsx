import React, { useState, useEffect } from 'react';
import Center from './Center';
import { toast } from 'react-toastify';
import axios from 'axios';
import Barcode from 'react-barcode';
import { motion } from 'framer-motion';
const AllStorage = () => {
  const API = import.meta.env.VITE_API;
  const [storage, setStorage] = useState([]);
  
  const fetchStorage = async () => {
    try {
      const target = `${API}storage`;
      const resp = await fetch(target);
      const data = await resp.json();
      setStorage(data);
    } catch (error) {
      console.error("Error fetching storage:", error);
      toast.error("Error fetching storage data");
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStorage = storage.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(storage.length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
    
  return (
    <Center>
      <div className="flex flex-col items-center gap-6 w-full px-2 overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300">
        <h2 className="textGradient text-4xl font-bold text-white">Storage List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {storage.map((item, i) => (
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
                  <span className="font-semibold text-gray-400">Total Cost:</span> ${item.cost}
                </div>
              </div>
              <div>
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
              </div>
            </motion.div>
          ))}
        </div>
        
      <div className="flex justify-center items-center gap-4 mt-6">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-md ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </Center>
  );
};

export default AllStorage;
