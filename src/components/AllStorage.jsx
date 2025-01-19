import React, { useState, useEffect } from 'react';
import Center from './Center';
import { toast } from 'react-toastify';
import axios from 'axios';
import Barcode from 'react-barcode';

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

  return (
    <Center>
      <div className="flex flex-col items-center gap-6 w-full md:w-[90%] overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300">
        <h2 className="textGradient text-4xl font-bold text-white">Storage List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {storage.map((item, i) => (
            <div
              key={i}
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
                      <div className="flex justify-center my-2">
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
            </div>
          ))}
        </div>
      </div>
    </Center>
  );
};

export default AllStorage;
