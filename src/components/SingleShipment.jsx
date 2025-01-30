import React, { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Popup from "./Popup";
import axios from "axios";
const API = import.meta.env.VITE_API;

const SingleShipment = () => {
  const location = useLocation();
  const { shipmentId } = location.state || {};

  const [shipmentData, setShipmentData] = useState({});
  const [popupData, setPopupData] = useState(null);

  const fetchStorage = async () => {
    try {
      const target = `${API}InboundOrders/${shipmentId}`;
      const resp = await fetch(target);
      const data = await resp.json();
      setShipmentData(data);
    } catch (error) {
      console.error("Error fetching inbound Orders:", error);
      toast.error("Error fetching inbound Orders data");
    }
  };


  const handleSaveChanges = async () => {
    try {
      
      const itemsArray = []
      for(let i =0 ; i < shipmentData.products.length ; i++){
        itemsArray.push({
          id : shipmentData.products[i].productId ,
          deliveredAmount : popupData.deliveredAmount? popupData.deliveredAmount : 0 ,
          isComplete : "true"
        })
      }
      console.log(itemsArray);
      console.log("////////////////////");
      
      console.log(DataToBeSent);
      

      const DataToBeSent = {
        id: popupData.id,
        pay : popupData.pay,
        items: itemsArray,
      };

      const token = localStorage.getItem("token");
      const target = API + "InboundOrders/fulfill";

      const response = await axios.post(target, DataToBeSent, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setShipmentData(updatedShipmentData);
        toast.success("Updated successfully");
      }

      setPopupData(null);
    } catch (error) {
      toast.error("Update Error!");
      console.error("Error updating order:", error);
    }
  };
  
  useEffect(() => {
    fetchStorage();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-indigo-500 mb-6">Shipment Details</h1>

        {/* General Shipment Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-500 mb-4">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Shipment ID</p>
              <p className="text-lg font-medium text-blue-800">{shipmentData.id}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Date</p>
              <p className="text-lg font-medium text-blue-800">
                {new Date(shipmentData.date).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Total Cost</p>
              <p className="text-lg font-medium text-blue-800">${shipmentData.cost}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Status</p>
              <p className="text-lg font-medium text-blue-800">{shipmentData.status}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Supplier</p>
              <p className="text-lg font-medium text-blue-800">{shipmentData.supplier}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-500">Shipping Cost</p>
              <p className="text-lg font-medium text-blue-800">${shipmentData.shippingCost}</p>
            </div>
          </div>
        </div>

        {/* Products Information */}
        <div>
          <h2 className="text-xl font-semibold text-indigo-500 mb-4">Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Cost Per Piece
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Received
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Waiting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">
                    fulfill
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {shipmentData.products?.map((product, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-indigo-800">{product.productName}</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">${product.costPerPiece}</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">{product.amount}</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">${product.totalCost}</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">{product.received}</td>
                    <td className="px-6 py-4 text-sm text-indigo-800">{product.waiting}</td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td>
                      <button className="bg-green-500 hover:bg-green-700 px-6 py-2 rounded-md"
                      onClick={()=>{setPopupData(product)}}
                      >
                        fulfill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {popupData && (
      <Popup
        title="fulfill Order"
        onClose={() => setPopupData(null)}
        actions={[
          {
            label: "Cancel",
            onClick: () => setPopupData(null),
            type: "secondary",
          },
          {
            label: "Save",
            onClick: handleSaveChanges,
            type: "primary",
          },
        ]}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label>Pay:</label>
            <input
              type="text"
              value={popupData.pay}
              onChange={(e) =>
                setPopupData({
                  ...popupData,
                  pay:e.target.value ,
                })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label>product:</label>
            <input
              type="text"
              value={popupData.productName}
              onChange={(e) =>
                e.preventDefault()
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label>delivered Amount:</label>
            <input
              type="number"
              value={popupData.deliveredAmount}
              onChange={(e) =>
                setPopupData({ ...popupData, deliveredAmount: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </Popup>
    )}
    </div>
  );
};

export default SingleShipment;