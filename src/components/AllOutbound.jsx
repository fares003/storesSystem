import React from 'react'
import { useState, useEffect,  } from "react";
import Center from "./Center";
import Popup from "./Popup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useInView from "@/Hooks/useInView";
import { useLogin } from "@/contexts/LoginContext";
import Loader from './Loader';

const API = import.meta.env.VITE_API;

const AllOutbound = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
  
    const fetchOrders = async () => {
        try {
          const target = API + "OutboundOrders";
          const resp = await fetch(target);
          const data = await resp.json();
          setOrders(data);
    
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
    };
    
  useEffect(()=>{
    fetchOrders() ;
  }, []);



  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    
    <Center className={"mt-2"}>
      {
        orders.length == 0 ? <Loader/> : (
          <>
            <div className="flex flex-col items-center gap-6 w-full md:w-[100%] px-2 overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300 ">
              <h2 className="textGradient text-4xl font-bold text-white">
                Orders List
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {currentOrders.map((item, i) => { 
                      
                      return(
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: i * 0.2 }}
                          className="bg-gray-800 text-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
                        >
                          <div className="flex flex-col gap-2">
                            <div>
                              <span className="font-semibold text-gray-400">Total:</span>{" "}
                              <span className="text-green-400 font-bold">EGP {item.total}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Cart Items:</h3>
                            <ul className="list-disc pl-6 text-sm text-gray-300">
                              {item.cart.map((product, j) => (
                                <li key={j}>
                                  {product.name} (x{product.quantity}) - EGP {product.price}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex justify-between mt-4">
                            

                            {(item.status === "In preparation" ||item.status === "pending preparation") && (
                              <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => navigate("/prepareToShipment", { state: { orderId: item.id} })}
                              >
                                Prepare
                              </button>
                            )}

                            <button
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
                              onClick={()=>{navigate("/OrderPreview", { state: { orderId: item.id} })}}
                              >
                                previrew
                            </button>
                          </div>
                        </motion.div>
                      )
                  })}

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
          </>
        )
      }
    </Center>
  )
}

export default AllOutbound















