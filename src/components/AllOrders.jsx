import { useState, useEffect } from "react";
import Center from "./Center";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowDown } from "lucide-react";
import Popup from "./Popup";
import axios from "axios";
import { toast } from "react-toastify";

function AllOrders() {
  const API = import.meta.env.VITE_API;
  const [orders, setOrders] = useState([]);
  const [popupData, setPopupData] = useState(null);

  const fetchOrders = async () => {
    const target = API + "orders";
    const resp = await fetch(target);
    const data = await resp.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    console.log(id);
    try {
      const token = localStorage.getItem("token");
      const target = API + "orders/delete/" + id;
      
      const response = await axios.delete(target, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((o) => o.id !== id));
        toast.success('Order deleted successfully!');
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error('Error deleting order');
    }
  };

  const handleUpdateOrder = (order) => {
    setPopupData(order);
  };


  const handleSaveChanges = async () => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === popupData.id ? popupData : order
      );
  
      const token = localStorage.getItem("token");
      const target = API + "orders/update";
      
    //   const dataToBeSent = {
    //     id : popupData.id ,
    //     "adminId": 0,
    //     "statusId": 0,
    //     "total": 0
    //   }
      const response = await axios.put(target, popupData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        setOrders(updatedOrders);
        toast.success("updated successfuly")
      }
  
      setPopupData(null);
    } catch (error) {
        toast.error("updated Error!")
      console.error("Error updating order:", error);
    }
  };

  return (
    <Center>
      <div className="flex flex-col items-center gap-4 w-full md:w-[90%] overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300 z-10 ">
        <div className="bg-[#323949] w-full flex flex-col gap-4 sticky top-0 z-20">
          <h2 className="flex items-center justify-center textGradient text-3xl text-white font-semibold">
            Orders List
          </h2>
          <div className="flex text-white w-full items-center justify-between px-5 py-2 ">
            <span>username</span>
            <span>status</span>
            <span>total</span>
            <span></span>
          </div>
        </div>

        <div className="w-full text-white text-lg shadow-lg shadow-slate-500 rounded-b-lg z-10">
          {orders.map((item, i) => (
            <Accordion key={i}>
              <AccordionSummary
                expandIcon={<ArrowDown />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <div className="flex w-full items-center justify-between">
                  <span>{item.customer.username}</span>
                  <span>{item.status}</span>
                  <span>{item.total}</span>
                  <span></span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <h3>Cart Items:</h3>
                <div className="grid grid-cols-12 gap-4 my-4">
                  {item.cart.map((product, j) => (
                    <div
                      key={j}
                      className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4 shadow-sm bg-gray-300 p-2 py-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span>Product name:</span>
                        <span>{product.name}</span>
                      </div>
                      <hr />
                      <div className="flex items-center justify-between">
                        <span>Quantity:</span>
                        <span>{product.quantity}</span>
                      </div>
                      <hr />
                      <div className="flex items-center justify-between">
                        <span>Price:</span>
                        <span>{product.price}$</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="float-right flex gap-2 mb-2">
                  <button
                    className="bg-orange-600 text-white px-4 py-1 rounded-md"
                    onClick={() => handleUpdateOrder(item)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded-md"
                    onClick={() => {
                      deleteOrder(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        {popupData && (
          <Popup
            title="Update Order"
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
                <label>Username:</label>
                <input
                  type="text"
                  value={popupData.customer.username}
                  onChange={(e) =>
                    setPopupData({ ...popupData, customer: {username : e.target.value} })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label>Status:</label>
                <input
                  type="text"
                  value={popupData.status}
                  onChange={(e) =>
                    setPopupData({ ...popupData, status: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label>Total:</label>
                <input
                  type="number"
                  value={popupData.total}
                  onChange={(e) =>
                    setPopupData({ ...popupData, total: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </Popup>
        )}
      </div>
    </Center>
  );
}

export default AllOrders;
