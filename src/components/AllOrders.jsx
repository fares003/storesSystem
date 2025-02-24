import { useState, useEffect } from "react";
import Center from "./Center";
import Popup from "./Popup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "./Loader";
import { FiEdit, FiTrash2, FiTruck, FiCheckCircle, FiInfo, FiPackage } from "react-icons/fi";
import { ArrowDown } from "lucide-react";

function AllOrders() {
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [AreYouSurePopup, setAreYouSurePopup] = useState({
    open:false,
    actions:()=>{}
  });
  
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;
  const [orders, setOrders] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [completePopupData, setCompletePopupData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updateCartOrOrder ,setUpdateCartOrOrder] = useState("update order")
  const itemsPerPage = 9;
  const activePopupWindow = "bg-blue-600 text-white px-2 py-1 rounded-md"

  const [items, setItems] = useState([]);


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
  const fetchItems = async () => {

    const target = `${API}item`;
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(target, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            setItems(response.data);
        } else {
            console.error("Failed to fetch items.");
        }
    } catch (error) {
        console.error("Error fetching items:", error);
    }
};

  const fetching = async ()=>{
      await fetchOrders();
      await Authority() ;
      await fetchServices()
      await fetchItems();
  }

  useEffect(()=>{
    fetching() ;
  }, []);


  const handleCompleteClick = (order) => {
    setCompletePopupData({
      id: order.id,
      code: "",
    });
  };

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
  const holdOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}orders/hold/${id}`;
  
      const response = await axios.put(
        target,
        {Notes:"bla"},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: "hold" } : order
          )
        );
        toast.success("Order hold successfully!");
      }
    } catch (error) {
      console.error("Error holding order:", error);
      toast.error("Error holding order");
    }
  };
  const cancelOrder =async (id)=>{
    try {
      const token = localStorage.getItem("token");
      const target = `${API}orders/cancel/${id}`;
  
      const response = await axios.delete(
        target,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: "cancel" } : order
          )
        );
        toast.success("Order canceled successfully!");
      }
    } catch (error) {
      console.error("Error canceled order:", error);
      toast.error("Error canceled order");
    }
  }
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
        service: selectedService 
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

  const handledeliver = async (id) =>{
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
        adminId: null, 
        statusId: null,
        total: popupData.total,
        customer: popupData.customer.name, 
        address: popupData.customer.address,
        phone: popupData.customer.phoneNumber,
        email: popupData.customer.email,
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
      orderId: completePopupData.id,
      code: completePopupData.code
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

const handlePendingDelivery = async (orderID)=>{
  try{
    const token = localStorage.getItem("token");
    const target = `${API}orders/deliver`
    const dataToBeSent = {
      "orderId": orderID,
      "service": selectedService
    }
    const response = await axios.post(target , dataToBeSent ,  {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }) ;

    if(response.status === 200){
      toast.success("successfully!");
    }
  }
  catch(error){
    console.log("error Pending Delivery" , error);
    toast.error("error Pending Delivery")
  }
}

const handleUpdateCart = async ()=>{
  try{
    const target = `${API}orders/update-cart` ;
    const token = localStorage.getItem("token") ;
    const dataToBeSent = {
      "orderId": popupData.id ,
      "productId": Number(popupData.product),
      "quantity": Number(popupData.quantity)
    }
    const response = await axios.post(target , dataToBeSent , {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    if(response.status === 200){
      toast.success("successfully!");
    }
  }
  catch(error){
    console.log(error) ;
    toast.error("error update order cart")
  }
}

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-500/20 text-blue-500';
      case 'Confirmed': return 'bg-purple-500/20 text-purple-500';
      case 'Ready for Shipping': return 'bg-yellow-500/20 text-yellow-500';
      case 'Delivered': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
      
    }
  };

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
    <Center className="py-8 px-4">
      {orders.length === 0 ? (
        <Loader />
      ) : (
        <div className="w-full overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              <FiPackage className="inline-block mr-3 mb-1" />
              Order Management
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                Showing {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} orders
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOrders.map((item, i) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order #{item.id}</h3>
                    <p className="text-sm text-gray-400">{item.customer.name}</p>
                  </div>
                  <span className={`${getStatusColor(item.status)} px-3 py-1 rounded-full text-sm`}>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <FiTruck className="mr-2 text-gray-400" />
                    <span className="text-gray-300">{item.customer.phoneNumber}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiInfo className="mr-2 text-gray-400" />
                    <span className="text-gray-300">{item.cart.length} items</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiCheckCircle className="mr-2 text-gray-400" />
                    <span className="text-emerald-400 font-semibold">EGP {item.total}</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate("/OrderPreview", { state: { orderId: item.id } })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
                    >
                      <FiInfo className="text-base" />
                      Details
                    </button>
                    
                    {item.status === "New" && (
                      <div className="relative flex">
                        <button
                          onClick={() => {
                            if (selectedAction === 'hold') {
                              setAreYouSurePopup({open:true , actions:()=>{holdOrder(item.id)}})
                            } else if (selectedAction === 'cancel') {
                              setAreYouSurePopup({open:true , actions:()=>{cancelOrder(item.id)}})
                            } else {
                              setAreYouSurePopup({open:true , actions:()=>{confirmOrder(item.id)}})
                            }
                          }}
                          className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
                            selectedAction === 'hold' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            selectedAction === 'cancel' ? 'bg-red-600 hover:bg-red-500' :
                            'bg-indigo-600 hover:bg-indigo-500'
                          }`}
                        >
                          {selectedAction === 'hold' ? 'Hold' :
                          selectedAction === 'cancel' ? 'Cancel' :
                          'Confirm'}
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                            className="px-3 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-r-lg transition-all"
                          >
                            <ArrowDown/>
                          </button>

                          {openDropdownId === item.id && (
                            <div className="absolute top-full right-0 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              {selectedAction !== 'confirm' && (
                                <button
                                  onClick={() => {
                                    setSelectedAction('confirm');
                                    setOpenDropdownId(null);
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                >
                                  confirm
                                </button>
                              )}

                              {selectedAction !== 'hold' && (
                                <button
                                  onClick={() => {
                                    setSelectedAction('hold');
                                    setOpenDropdownId(null);
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                >
                                  Hold
                                </button>
                              )}
                              
                              {selectedAction !== 'cancel' && (
                                <button
                                  onClick={() => {
                                    setSelectedAction('cancel');
                                    setOpenDropdownId(null);
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {item.status === "pending delivery" && (
                      <div className="relative flex">
                        <button
                          onClick={() => {
                            if (selectedService) {
                              setAreYouSurePopup({
                                open: true,
                                actions: () => handlePendingDelivery(item.id)
                              })
                            }
                          }}
                          disabled={!selectedService}
                          className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
                            selectedService 
                              ? 'bg-emerald-600 hover:bg-emerald-500' 
                              : 'bg-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {selectedService || 'Services'}
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                            className="px-3 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-r-lg transition-all"
                          >
                            <ArrowDown/>
                          </button>

                          {openDropdownId === item.id && (
                            <div className="absolute top-full right-0 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              {services.map((service) => (
                                <button
                                  key={service}
                                  onClick={() => {
                                    setSelectedService(service);
                                    setOpenDropdownId(null);
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                >
                                  {service}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {item.status === "Ready for Shipping" && (
                      <div className="flex gap-2 w-full">
                        <select
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm flex-1"
                        >
                          <option value="" disabled>Select Service</option>
                          {services.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handledeliver(item.id)}
                          disabled={!selectedService}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-all disabled:opacity-50"
                        >
                          Deliver
                        </button>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateOrder(item)}
                          className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 transition-all"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        {/* <button
                          onClick={() => deleteOrder(item.id)}
                          className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-all"
                        >
                          <FiTrash2 className="text-lg" />
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
            >
              ←
            </button>
            
            {Array.from({ length: end - start + 1 }, (_, index) => start + index).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === page 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Popups */}
      {popupData && (
        <Popup
          title="Update Order"
          onClose={() => setPopupData(null)}
          actions={[
            { label: "Cancel", onClick: () => setPopupData(null), type: "secondary" },
            { label: "Save", onClick: ()=>{
              updateCartOrOrder==="update order" ? handleSaveChanges() : handleUpdateCart()
            }, type: "primary" },
          ]}
        >
          <div className="flex flex-col gap-1">
            <div className="flex gap-4 items-center justify-center">
              <span className={`${updateCartOrOrder==="update order" ? activePopupWindow :""} transition-all cursor-pointer`} onClick={()=>setUpdateCartOrOrder("update order")}>update order data</span>
              <span className={`${updateCartOrOrder==="update cart"  ? activePopupWindow : ""} transition-all cursor-pointer`} onClick={()=>setUpdateCartOrOrder("update cart")}>update cart</span>
            </div>
            {
              updateCartOrOrder === "update order" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300">Order ID</label>
                      <input
                        value={popupData.id}
                        onChange={(e) => {e.preventDefault()}}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300">Total</label>
                      <input
                        type="number"
                        value={popupData.total}
                        onChange={(e) => setPopupData({...popupData, total: e.target.value})}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-400">Customer Information</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300">Name</label>
                        <input
                          value={popupData.customer.name}
                          onChange={(e) => setPopupData({...popupData, customer: {
                            ...popupData.customer,
                            name: e.target.value
                          }})}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm text-gray-300">Phone</label>
                          <input
                            value={popupData.customer.phoneNumber}
                            onChange={(e) => setPopupData({...popupData, customer: {
                              ...popupData.customer,
                              phoneNumber: e.target.value
                            }})}
                            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-gray-300">Email</label>
                          <input
                            value={popupData.customer.email}
                            onChange={(e) => setPopupData({...popupData, customer: {
                              ...popupData.customer,
                              email: e.target.value
                            }})}
                            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300">Address</label>
                        <input
                          value={popupData.customer.address}
                          onChange={(e) => setPopupData({...popupData, customer: {
                            ...popupData.customer,
                            address: e.target.value
                          }})}
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300">Order ID</label>
                      <input
                        value={popupData.id}
                        onChange={(e) => {e.preventDefault()}}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1 flex flex-col">
                      <label className="text-sm text-gray-300">Product</label>
                      <select
                          value={popupData.product}
                          onChange={(e) => setPopupData({...popupData , product: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm flex-1"
                        >
                          <option value="" disabled>select Product</option>
                          {items.map((item) => (
                            <option key={item} value={item.id}>{item.name}</option>
                          ))}
                      </select>

                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300">Quantity</label>
                      <input
                        value={popupData.quantity}
                        onChange={(e) => {setPopupData({...popupData , quantity : e.target.value})}}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                </div>
              )
            }
          </div>

        </Popup>
      )}

      {completePopupData && (
        <Popup
          title="Complete Order"
          onClose={() => setCompletePopupData(null)}
          actions={[
            { label: "Cancel", onClick: () => setCompletePopupData(null), type: "secondary" },
            { label: "Confirm", onClick: handleSaveCode, type: "primary" },
          ]}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Confirmation Code</label>
              <input
                value={completePopupData.code}
                onChange={(e) => setCompletePopupData({
                  ...completePopupData,
                  code: e.target.value
                })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter verification code"
              />
            </div>
          </div>
        </Popup>
      )}

      {
        AreYouSurePopup.open && (
          <Popup 
          title={"Are You Sure"}
          onClose={() => setAreYouSurePopup({
            ...AreYouSurePopup , 
            open : false
          })}
          actions={[
            { label: "Cancel", onClick: () => {
              setAreYouSurePopup({
                ...AreYouSurePopup , 
                open : false
              })
            }, type: "secondary" },
            { label: "Save", onClick: ()=>{AreYouSurePopup.actions(); setAreYouSurePopup({open:false , actions:null})}, type: "primary" },
          ]}
          >
            <div className="flex flex-col items-center gap-4">
              <p className="font-bold text-xl">Are you sure ?</p>
              <span className="text-gray-600">You can't undo this</span>
            </div>
          </Popup>
        )
      }
    </Center>
  );
}

export default AllOrders;



