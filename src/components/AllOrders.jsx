import { useState, useEffect, useRef } from "react";
import Center from "./Center";
import Popup from "./Popup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useInView from "@/Hooks/useInView";
import { useLogin } from "@/contexts/LoginContext";

function AllOrders() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;
  const [orders, setOrders] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [completePopupData, setCompletePopupData] = useState(null);
  const [isAdmin , setIsAdmin] = useState(false) ;
  const [services , setServices] = useState([]) ;
  const [selectedservices , setSelectedservices] = useState("") ;


  const Authority = async () => {
      try {
        const token = localStorage.getItem("token");
        const target = `${API}Authority/roles`;

        const response = await axios.get(target, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data
        setIsAdmin( !!data.find( (element)=> element === "admin") )
        console.log(isAdmin);
    } 
    catch(error){
      console.log(error);
    }
  }
  const fetchServices = async () => {
    try {
      const target = API + "shipping/services";
      const resp = await fetch(target);
      const data = await resp.json();
      setServices(data);

    } catch (error) {
      console.error("Error shipping/services orders:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const target = API + "orders";
      const resp = await fetch(target);
      const data = await resp.json();
      setOrders(data);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchStatusOptions = async () => {
    try {
      const target = API + "orders/status";
      const resp = await fetch(target);
      const data = await resp.json();
      setStatusOptions(data);
    } catch (error) {
      console.error("Error fetching status options:", error);
    }
  };
  const fetching = async ()=>{
      await fetchOrders();
      await fetchStatusOptions();
      await Authority() ;
      await fetchServices()
  }

  useEffect(()=>{
    fetching() ;
  }, []);

  const deleteOrder = async (id) => {
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
        toast.success("Order deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };

  const confirmOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}orders/confirm/${id}`;

      const response = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: "Confirmed" } : order
          )
        );
        toast.success("Order confirmed successfully!");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Error confirming order");
    }
  };

  const deliverOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}shipping/deliver`;

      const data = {
        orderId: orderId,
        service: selectedservices
      };

      const response = await axios.post(target, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Delivered" } : order
          )
        );
        toast.success("Order delivered successfully!");
      }
    } catch (error) {
      console.error("Error delivering order:", error);
      toast.error("Error delivering order");
    }
  };

  const handleDelever = async (id) =>{
    await deliverOrder(id);
    // navigate("/Shipping", { state: { orderId: id} })

  }
  const handleSaveChanges = async () => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === popupData.id ? popupData : order
      );
      const DataToBeSent = {
        id: popupData.id,
        // nead omar send me admin id 
        adminId: 0,
        statusId: popupData.status,
        total: popupData.total,
      };

      const token = localStorage.getItem("token");
      const target = API + "orders/update";

      const response = await axios.put(target, DataToBeSent, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setOrders(updatedOrders);
        toast.success("Updated successfully");
      }

      setPopupData(null);
    } catch (error) {
      toast.error("Update Error!");
      console.error("Error updating order:", error);
    }
  };
  const handleUpdateOrder = (order) => {
    setPopupData(order);
  };
  

const handleSaveCode = async () => {
  try {
    const token = localStorage.getItem("token");
    const target = `${API}orders/complete`;
    const data = {
      orderId: popupData.id,
      code: popupData.code,
    };

    const response = await axios.post(target, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      toast.success("Order completed successfully!");
      setPopupData(null);
    }
  } catch (error) {
    console.error("Error completing order:", error);
    toast.error("Error completing order");
  }
};

  const handleCompleteClick = (order) => {
    setCompletePopupData({
      id: order.id,
      code: "",
    });
  };

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    
    const maxPaginationButtons = 5;

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
<Center className="mt-4">
  <div className="flex flex-col items-center gap-6 w-full md:w-[90%] lg:w-[96%] px-2 overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300">
    <h2 className="textGradient text-4xl font-bold text-white">Orders List</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {currentOrders.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className="bg-gray-800 text-white rounded-lg shadow-lg p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold text-gray-400">Username:</span>{" "}
              {item.customer.name}
            </div>
            <div>
              <span className="font-semibold text-gray-400">Phone:</span>{" "}
              {item.customer.phoneNumber}
            </div>
            <div>
              <span className="font-semibold text-gray-400">Status:</span>{" "}
              {item.status}
            </div>
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
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition flex-1"
              onClick={() => handleUpdateOrder(item)}
            >
              Update
            </button>
            {item.status === "New" && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => confirmOrder(item.id)}
              >
                Confirm
              </button>
            )}
            {item.status === "Ready for Shipping" && (
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <select
                  name="inventoryId"
                  className="p-2 rounded-md bg-transparent border text-white flex-1"
                  value={selectedservices}
                  onChange={(e) => setSelectedservices(e.target.value)}
                >
                  <option className="bg-slate-600" value="" disabled>
                    Select a method
                  </option>
                  {services.map((ele, i) => (
                    <option className="bg-slate-600" key={i} value={ele}>
                      {ele}
                    </option>
                  ))}
                </select>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition flex-1"
                  onClick={() => handleDelever(item.id)}
                  disabled={!selectedservices}
                >
                  Deliver
                </button>
              </div>
            )}
            {item.status === "Delivered" && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleCompleteClick(item)}
              >
                Complete
              </button>
            )}
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition flex-1"
              onClick={() => navigate("/OrderPreview", { state: { orderId: item.id } })}
            >
              Preview
            </button>
            {isAdmin && (
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition flex-1"
                onClick={() => deleteOrder(item.id)}
              >
                Delete
              </button>
            )}
          </div>
        </motion.div>
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
                setPopupData({
                  ...popupData,
                  customer: { username: e.target.value },
                })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              value={popupData.status}
              onChange={(e) =>
                setPopupData({ ...popupData, status: Number(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
            >
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
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

    {completePopupData && (
      <Popup
        title="Complete Order"
        onClose={() => setCompletePopupData(null)}
        actions={[
          {
            label: "Cancel",
            onClick: () => setCompletePopupData(null),
            type: "secondary",
          },
          {
            label: "Save Code",
            onClick: handleSaveCode,
            type: "primary",
          },
        ]}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label>Order Code:</label>
            <input
              type="text"
              value={completePopupData.code}
              onChange={(e) =>
                setCompletePopupData({
                  ...completePopupData,
                  code: e.target.value,
                })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </Popup>
    )}

    <div className="flex justify-center items-center gap-2 mt-6">
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
}

export default AllOrders;
