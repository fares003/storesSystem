import React from 'react'
import { useState, useEffect } from "react";
import Center from "./Center";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowDown } from "lucide-react";
import Popup from "./Popup";
import axios from "axios";
import { toast } from "react-toastify";
import Barcode from 'react-barcode';

const AllStorage = () => {
  const API = import.meta.env.VITE_API;
  const [storage, setStorage] = useState([]);

  const fetchStorage = async () => {
    const target = API + "storage";
    const resp = await fetch(target);
    const data = await resp.json();
    setStorage(data);
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  return (
    
    <Center>
      <div className="flex flex-col items-center gap-4 w-full md:w-[90%] overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300 z-10 ">
        <div className="bg-[#323949] w-full flex flex-col gap-4 sticky top-0 z-20">
          <h2 className="flex items-center justify-center textGradient text-3xl text-white font-semibold">
            Storage List
          </h2>
          <div className="flex text-white w-full items-center justify-between px-5 py-2 ">
            <span>Id</span>
            <span>Date</span>
            <span>Cost</span>
            <span></span>
          </div>
        </div>

        <div className="w-full text-white text-lg shadow-lg shadow-slate-500 rounded-b-lg z-10">
          {storage.map((item, i) => (
            <Accordion key={i}>
              <AccordionSummary
                expandIcon={<ArrowDown />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="flex w-full items-center justify-between">
                  <span>{item.id}</span>
                  <span>{item.date}</span>
                  <span>{item.cost}</span>
                  <span></span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <h3>Products :</h3>
                <div className="grid grid-cols-12 gap-4 my-4">
                  {item.products.map((product, j) => (
                    <div
                      key={j}
                      className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4 shadow-sm bg-gray-300 p-2 py-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>Product id :</span>
                        <span>{product.productId}</span>
                      </div>
                      <hr />
                      <div className="flex items-center justify-between">
                        <span>Quantity:</span>
                        <span>{product.amount}</span>
                      </div>
                      <hr />
                      <div className="flex items-center justify-between">
                        <span>cost Per Piece:</span>
                        <span>{product.costPerPiece}$</span>
                      </div>
                      <hr />
                      <div className="flex flex-col items-center gap-4 w-full ">
                        <span>barcode : </span>
                        <span className=''>
                          <Barcode
                            value={product.barcode}
                            format="CODE128"
                            width={1}
                            height={50}
                            displayValue={true}
                            fontSize={14} 
                            background="#f9f9f9"
                            lineColor="#000" 
                            className="custom-barcode max-w-full"
                          />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </Center>
  )
}

export default AllStorage



















