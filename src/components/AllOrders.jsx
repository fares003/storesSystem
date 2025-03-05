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
import OrderCard from "./OrderCard";
import { NewOrderActions, PendingDeliveryActions} from "./ActionComponents";
import { useAreYouSure } from "@/contexts/AreYouSure";

function AllOrders() {
  
  const API = import.meta.env.VITE_API;
  const [orders, setOrders] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [completePopupData, setCompletePopupData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateCartOrOrder ,setUpdateCartOrOrder] = useState("update order")
  const itemsPerPage = 9;
  const [selectedService, setSelectedService] = useState("");
  const activePopupWindow = "bg-blue-600 text-white px-2 py-1 rounded-md"
  const {AreYouSurePopup } = useAreYouSure() ;

  // update cart states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);


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
      await Authority() ;
      await fetchServices()
      await fetchItems();
  }

  useEffect(()=>{
    fetching() ;
  }, []);

  useEffect(()=>{
    fetchOrders();
  },[AreYouSurePopup])

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
    const itemsTobeSent = [];
    popupData.updatedCart.forEach((ele)=>{
      itemsTobeSent.push({
        "productId" : ele.productId,
        "quantity" : ele.quantity,
        "price" : ele.price
      })
    })
    const dataToBeSent = {
      "orderId": popupData.id ,
      "items" : itemsTobeSent
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
              <OrderCard
                key={i}
                item={item}
                i={i}
                actionsConfig={{
                  'New': NewOrderActions,
                  'pending delivery': PendingDeliveryActions,
                }}
                cardClickable={true}
                handleUpdateOrder={handleUpdateOrder}
                cancelOrder={cancelOrder}
                handlePendingDelivery={handlePendingDelivery}
                confirmOrder={confirmOrder}
                holdOrder={holdOrder}
                shippingServices={services}
                isAdmin={isAdmin}
                setSelectedService={setSelectedService}
              />
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
                <div className="flex flex-col md:flex-row gap-6 max-h-[75vh]">
                  {/* Order Summary Section */}
                  
                  <div className="flex-1 bg-slate-700 p-6 rounded-lg shadow-lg text-white max-h-[32vh] md:max-h-[70vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                      {(() => {
                        const mergedCart = [...(popupData.cart || [])];
                        (popupData.updatedCart || []).forEach(updatedItem => {
                          const index = mergedCart.findIndex(
                            item => item.productId === updatedItem.productId
                          );
                          if (index !== -1) {
                            mergedCart[index] = updatedItem;
                          } else {
                            mergedCart.push(updatedItem);
                          }
                        });

                        return (
                          <>
                            {mergedCart.map((item, index) => {
                              const product = items.find(i => i.id === Number(item.productId));
                              return (
                                <div key={index} className="border-b border-slate-500 pb-2">
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {product?.name || "Unknown Product"}
                                    </span>
                                    <span>x{item.quantity}</span>
                                  </div>
                                  <div className="flex justify-between text-slate-300">
                                    <span>Price: ${item.price.toFixed(2)}</span>
                                    <span>Total: ${(item.quantity * item.price).toFixed(2)}</span>
                                  </div>
                                </div>
                              );
                            })}
                            
                            <p className="text-lg pt-4 border-t border-slate-500">
                              <span className="font-medium">Total:</span> 
                              ${mergedCart
                                .reduce((sum, item) => sum + (item.quantity * item.price), 0)
                                .toFixed(2)}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Add Item Section */}
                  <div className="flex-1 bg-slate-400 p-6 rounded-lg shadow-lg text-black max-h-[32vh] md:max-h-[70vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">Add/Edit Item</h2>
                    <div className="space-y-4">
                      {/* Product Selector */}
                      <div className="flex flex-col">
                        <label className="mb-1 font-medium">Product</label>
                        <select 
                          className="p-2 rounded border border-gray-300 overflow-x-clip"
                          value={selectedProduct}
                          onChange={(e) => {
                            const productId = Number(e.target.value);
                            const existingItem = popupData.updatedCart?.find(item => 
                              Number(item.productId) === productId
                            );
                            
                            setSelectedProduct(productId);
                            if(existingItem) {
                              setCurrentQty(existingItem.quantity);
                              setCurrentPrice(existingItem.price);
                            } else {
                              setCurrentQty(1);
                              setCurrentPrice(items.find(i => i.id === productId)?.price || 0);
                            }
                          }}
                        >
                          <option value="" disabled>Select Product</option>
                          {items.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} (${item.price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="mb-1 block font-medium">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={currentQty}
                            onChange={(e) => setCurrentQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="mb-1 block font-medium">Price</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                        onClick={() => {
                          if(!selectedProduct) return;
                          
                          const product = items.find(i => i.id === selectedProduct);
                          
                          const newItem = {
                            productId: selectedProduct,
                            name: product?.name || "Unknown Product",
                            quantity: currentQty,
                            price: currentPrice
                          };

                          setPopupData(prev => {
                            const filteredCart = (prev.cart || []).filter(
                              item => item.productId !== selectedProduct
                            );

                            const existingIndex = prev.updatedCart?.findIndex(item => 
                              Number(item.productId) === selectedProduct
                            ) ?? -1;

                            const newCart = [...(prev.updatedCart || [])];
                            
                            if(existingIndex > -1) {
                              newCart[existingIndex] = newItem;
                            } else {
                              newCart.push(newItem);
                            }

                            return {
                              ...prev,
                              cart: filteredCart,
                              updatedCart: newCart,
                              total: [...filteredCart, ...newCart]
                                .reduce((sum, item) => sum + (item.quantity * item.price), 0)
                            };
                          });

                          setSelectedProduct("");
                          setCurrentQty(1);
                          setCurrentPrice(0);
                        }}
                      >
                        {selectedProduct ? "Update Item" : "Add Item"}
                      </button>
                    </div>
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
    </Center>
  );
}

export default AllOrders;
