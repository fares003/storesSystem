import React from 'react'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import { motion } from "framer-motion";
import Select from '@mui/material/Select';
import { Button, Input, MenuItem } from '@mui/material';
const API = import.meta.env.VITE_API;

const AllInventory = () => {

  const [Inventory, setInventory] = useState([]);
  const [paginationInventory, setPaginationInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedManager, setSelectedManager] = useState("select manger");
  const [filteredInventory , setFilteredInventory] = useState([]) ;
  const [Authusers , setAuthusers] = useState([]);
  const [selectedAuthusers , setSelectedAuthusers] = useState([]);
  
  useEffect(()=>{
    paginationInventory.forEach((ele)=>{
      ele.manager == selectedManager && setFilteredInventory(ele.items)
    })
  },[selectedManager])
  
  const InventoryPerPage = 20;

  useEffect(() => {
      fetchInventory();
      fetchAuthusers() ; 
  }, []);

  const fetchInventory = async () => {
      const target = `${API}Inventory`;
      try {
          const token = localStorage.getItem("token");
          const response = await axios.get(target, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          if (response.status === 200) {
              setInventory(response.data);
              paginate(1, response.data);
          } else {
              console.error("Failed to fetch Inventory.");
          }
      } catch (error) {
          console.error("Error fetching Inventory:", error);
      }
  };

  const fetchAuthusers = async () => {
    const target = `${API}auth`;
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(target, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            setAuthusers(response.data);
        } else {
            console.error("Failed to fetch Inventory.");
        }
    } catch (error) {
        console.error("Error fetching Inventory:", error);
    }
};

  const handleCreateInventory = async () => {
    const target = `${API}Inventory/create`;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        target,
        { managerId: selectedAuthusers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Inventory created successfully!');
        fetchInventory(); // Refresh the inventory list
      } else {
        toast.error('Failed to create inventory.');
      }
    } catch (error) {
      console.error('Error creating inventory:', error);
      toast.error('Error creating inventory. Please try again.');
    }
  };
  const paginate = (pageNumber, data = Inventory) => {
      const startIndex = (pageNumber - 1) * InventoryPerPage;
      const endIndex = startIndex + InventoryPerPage;
      const tempInventory = data.slice(startIndex, endIndex);
      setPaginationInventory(tempInventory);
      setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(Inventory.length / InventoryPerPage);

  return (
    <Center className={"px-5 bg-gray-200"}>
      <h2 className="textGradient text-4xl font-bold text-gray-900 mb-4">
          Inventory
      </h2>
      <div className='w-full mb-4 flex flex-col md:flex-row gap-8  items-center justify-around text-gray-800 font-semibold'>
        <div>
        <label htmlFor="selectManager">select inventory manger : </label>
          <Select
            className='w-40 text-black'
            id='selectManager'
            color='[#000]'
            value={selectedManager}
            onChange={(e)=>{setSelectedManager(e.target.value)}}
          >
            {
              paginationInventory.map((ele , i )=>(<MenuItem  key={i} value={ele.manager}>{ele.manager}</MenuItem>))
            }
          </Select>
        </div>

        <div className='flex items-center justify-around gap-4 mb-4 mt-4'>
        <Select
            className='w-40 text-black'
            id='selectManager'
            color='[#000]'
            value={selectedAuthusers}
            onChange={(e)=>{setSelectedAuthusers(e.target.value)}}
          >
            {
              Authusers.map((ele , i )=>(<MenuItem  key={i} value={ele.id}>{ele.username}</MenuItem>))
            }
          </Select>
          <Button
           variant='contained'
           onClick={handleCreateInventory}
          >
            Create inventory
          </Button>
        </div>
      </div>
      <div className="w-full overflow-x-auto text-white text-lg shadow-md rounded-lg bg-gray-900">
          <table className="min-w-full table-auto text-sm text-left">
              <thead className="bg-gray-800 text-gray-200">
                  <tr>
                      <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">product Id</th>
                      <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Name</th>
                      <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">minimum</th>
                      <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Available</th>
                      <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Reserved</th>
                  </tr>
              </thead>
              <tbody>
                  {filteredInventory.map((item, i) => (
                      <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className={`text-center ${
                              i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                          } hover:bg-gray-600 transition-colors duration-200`}
                      >
                          <td className="px-6 py-3 border-b border-gray-700">{item.productId}</td>
                          <td className="px-6 py-3 border-b border-gray-700">{item.product}</td>
                          <td className="px-6 py-3 border-b border-gray-700">EGP {item.minimum}</td>
                          <td className="px-6 py-3 border-b border-gray-700">{item.available}</td>
                          <td className="px-6 py-3 border-b border-gray-700">{item.reserved}</td>
                          
                      </motion.tr>
                  ))}
              </tbody>
          </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
          <button
              className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                  currentPage === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-700"
              } text-white`}
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
          >
              Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
              <button
                  key={index + 1}
                  className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                      currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                  onClick={() => paginate(index + 1)}
              >
                  {index + 1}
              </button>
          ))}
          <button
              className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                  currentPage === totalPages
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-700"
              } text-white`}
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
          >
              Next
          </button>
      </div>
    </Center>
  )
}

export default AllInventory
