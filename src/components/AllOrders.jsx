import { useState, useEffect } from "react";
import Center from "./Center";
import Popup from "./Popup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "./Loader";
import {
  FiEdit,
  FiTrash2,
  FiTruck,
  FiCheckCircle,
  FiInfo,
  FiPackage,
} from "react-icons/fi";
import { ArrowDown } from "lucide-react";
import OrderCard from "./OrderCard";
import {
  canceledOrderActions,
  completeActionOrderActions,
  deliveredActionOrderActions,
  holdActionOrderActions,
  inPreparationOrderActions,
  InTransitOrderActions,
  NewOrderActions,
  PartiallyDeliveredActionOrderActions,
  PendingDeliveryActions,
  pendingPreparationOrderActions,
  readyForShipmentActionOrderActions,
  ReturnedActionOrderActions,
} from "./ActionComponents";
import { useAreYouSure } from "@/contexts/AreYouSure";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import Swal from "sweetalert2";

function AllOrders() {
  const API = import.meta.env.VITE_API;
  const [orders, setOrders] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [completePopupData, setCompletePopupData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateCartOrOrder, setUpdateCartOrOrder] = useState("update order");
  const itemsPerPage = 9;
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceForMultiple, setSelectedServiceForMultiple] =
    useState("");
  const activePopupWindow = "bg-blue-600 text-white px-2 py-1 rounded-md";
  const { AreYouSurePopup } = useAreYouSure();
  const [filtersOn, setFiltersOn] = useState(false);
  // update cart states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [stores, setStores] = useState([]);
  const [governments, setGovernments] = useState([]);
  const [select, setSelect] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [showServiceSelect, setShowServiceSelect] = useState(false);
  const statuses = [
    "New",
    "Confirmed",
    "Cancelled",
    "In preparation",
    "Ready for Shipping",
    "ready for shipment",
    "In Transit",
    "Delivered",
    "Returned",
    "Partially Delivered",
    "Complete",
    "pending delivery",
    "pending preparation",
    "hold",
  ];
  const [filters, setFilters] = useState({
    status: "",
    fromDate: null,
    toDate: null,
    store: "",
    address: "",
  });
  useEffect(() => {
    const settingsString = localStorage.getItem("settings");
    try {
      const settings = settingsString ? JSON.parse(settingsString) : null;
      if (settings && settings.length > 2) {
        setWidth(settings[1]?.defaultValue || "");
        setHeight(settings[2]?.defaultValue || "");
      }
    } catch (error) {
      console.error("Error parsing settings from localStorage:", error);
    }
  }, []);
  const changeStatusFilter = (status) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status, // just assign the selected value directly
    }));
  };

  const changeFromDateFilter = (date) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      fromDate: prevFilters.fromDate === date ? null : date, // Toggle date
    }));
  };

  const changeToDateFilter = (date) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      toDate: prevFilters.toDate === date ? null : date,
    }));
  };
  const [items, setItems] = useState([]);
  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}store`;
      const response = await axios.get(target, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data);
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  const fetchGovernment = async () => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}Gov`;
      const response = await axios.get(target, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log(data);
      setGovernments(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const openFilterPopup = () => {
    setFiltersOn(true);
    fetchStores();
    fetchGovernment();
  };
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
      const data = response.data;
      setIsAdmin(!!data.find((element) => element === "admin"));
      console.log(isAdmin);
    } catch (error) {
      console.log(error);
    }
  };
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

  const fetchOrders = async (filters = {}) => {
    try {
      const token = localStorage.getItem("token");
      const target = API + "Orders"; // Note capitalization to match your endpoint

      // Prepare query parameters (all optional)
      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        ...(filters.store && { store: filters.store }),
        ...(filters.address && { address: filters.address }),
      };

      const resp = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params, // Add query parameters
      });
      if (resp.status === 200) {
        setIsLoading(false);
        if (resp.data.length === 0) {
          toast.error("No orders found with the selected filters.");
          return;
        }
      }
      const data = resp.data;
      setOrders(data);
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // Re-throw to allow handling in calling code
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

  const fetching = async () => {
    await Authority();
    await fetchServices();
    await fetchItems();
  };

  useEffect(() => {
    fetching();
  }, []);

  // useEffect(() => {
  //   const fetchOrdersInterval = setInterval(fetchOrders, 5000);

  //   return () => clearInterval(fetchOrdersInterval); // Cleanup interval on component unmount
  // }, []);
  useEffect(() => {
    fetchOrders(filters);
  }, []);

  const holdOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}orders/hold/${id}`;

      const response = await axios.put(
        target,
        { Notes: "bla" },
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
  const cancelOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}orders/cancel/${id}`;

      const response = await axios.delete(target, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
  const invoiceOrder = async (id) => {
    try {
      console.log(id);
      const response = await axios.post(
        `${API}Orders/invoice`,
        {
          orderId: [id],
          width: width,
          height: height,
        },
        {
          responseType: "blob",
        }
      );

      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.log("Error fetching invoice:", error);
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
        code: completePopupData.code,
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
  const handlePendingDeliveries = async (service) => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}orders/deliver`;
  
      for (const orderID of selectedOrders) {
        const dataToBeSent = {
          orderId: orderID,
          service: service, // use passed-in service
        };
  
        const response = await axios.post(target, dataToBeSent, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 200) {
          toast.success(`Order ${orderID} delivered successfully!`);
        }
      }
    } catch (error) {
      console.log("Error in pending deliveries:", error);
      toast.error("One or more deliveries failed.");
    }
  };
  

  const handlePendingDelivery = async (orderID) => {
    try {
      const token = localStorage.getItem("token");
      const target = `${API}orders/deliver`;
      const dataToBeSent = {
        orderId: orderID,
        service: selectedService,
      };
      const response = await axios.post(target, dataToBeSent, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("successfully!");
      }
    } catch (error) {
      console.log("error Pending Delivery", error);
      toast.error("error Pending Delivery");
    }
  };
  // In parent component
  const [selectedOrders, setSelectedOrders] = useState([]);

  const handleToggleSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  const handleUpdateCart = async () => {
    try {
      const target = `${API}orders/update-cart`;
      const token = localStorage.getItem("token");
      const itemsTobeSent = [];
      popupData.updatedCart.forEach((ele) => {
        itemsTobeSent.push({
          productId: ele.productId,
          quantity: ele.quantity,
          price: ele.price,
        });
      });
      const dataToBeSent = {
        orderId: popupData.id,
        items: itemsTobeSent,
      };
      const response = await axios.post(target, dataToBeSent, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        toast.success("successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("error update order cart");
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
  const handleSelectOption = () => {
    if (select) {
      setSelectedOrders([]);
      setSelect(false);
    } else {
      setSelect(true);
    }
    setSelect(!select);
  };
  const handleCancelMultipleOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      let response = null;
      for (const orderId of selectedOrders) {
        const target = `${API}orders/cancel/${orderId}`;

        response = await axios.delete(target, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      if (response.status === 200) {
        toast.success("Selected orders canceled successfully!");
      }
      setSelectedOrders([]); // Clear selected orders after processing
    } catch (error) {
      console.error("Error canceling orders:", error);
      toast.error("Error canceling orders");
    }
  };
  const handleConfirmMultipleOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      let response = null;
      for (const orderId of selectedOrders) {
        const target = `${API}orders/confirm/${orderId}`;

        response = await axios.get(target, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      if (response.status === 200) {
        toast.success("Selected orders confirming successfully!");
      }
      setSelectedOrders([]); // Clear selected orders after processing
    } catch (error) {
      console.error("Error confirming orders:", error);
      toast.error("Error confirming orders");
    }
  };
  const handleInvoiceMultipleOrders = async () => {
    try {
      const response = await axios.post(
        `${API}Orders/invoice`,
        {
          orderId: selectedOrders,
          width: width,
          height: height,
        },
        {
          responseType: "blob",
        }
      );

      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.log("Error fetching invoice:", error);
    }
  };
  const { start, end } = getPaginationRange();

  return (
    <Center className="py-8 px-4">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full overflow-y-auto scrollbar-thin pr-4">
          <div
            className={`flex justify-between mb-8 ${
              errorMsg ? " relative top-0 " : ""
            }`}
          >
            <h1 className="text-3xl font-bold text-white">
              <FiPackage className="inline-block mr-3 mb-1" />
              Order Management
            </h1>

            <motion.div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Link
                  to="/addorder"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  <FiEdit />
                  <span>New Order</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Link
                  to="/options"
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200"
                >
                  <FiEdit className="text-lg" />
                  <span className="font-semibold">Manage Options</span>
                </Link>
              </motion.div>
              <div
                className="text-white cursor-pointer hover:opacity-[50%] flex gap-3 items-center"
                onClick={() => openFilterPopup()}
              >
                <FaFilter />
                <span>| Filters</span>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    onChange={(e) => {
                      handleSelectOption();
                    }}
                  />
                  <div
                    className={`
      w-5 h-5 rounded-md border-2
      border-indigo-600 bg-white
      flex items-center justify-center
      peer-checked:bg-blue-500 peer-checked:border-indigo-700
      transition-colors duration-200
    `}
                  ></div>
                  <span className="text-white font-[500]">Select</span>
                </label>
              </div>
              <motion.div>
                <select
                  className="px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const action = e.target.value;
                    setSelectedAction(action);

                    if (action === "") return;

                    if (selectedOrders.length === 0) {
                      toast.error(`Please select orders to ${action}`);
                      setSelectedAction(""); // Reset selection
                      return;
                    }

                    if (action === "pending delivery") {
                      setShowServiceSelect(true);
                    } else {
                      Swal.fire({
                        title: `Are you sure?`,
                        text: `This will ${action} the selected orders.`,
                        icon: action === "cancel" ? "warning" : "question",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          if (action === "cancel") handleCancelMultipleOrders();
                          else if (action === "confirm")
                            handleConfirmMultipleOrders();
                          else if (action === "invoice")
                            handleInvoiceMultipleOrders();
                        }
                        setSelectedAction(""); 
                        fetchOrders(filters); 
                      });
                    }
                  }}
                  value={selectedAction}
                >
                  <option value="">Select Action</option>
                  <option value="confirm">Confirm Orders</option>
                  <option value="cancel">Cancel Orders</option>
                  <option value="invoice">Invoice Orders</option>
                  <option value="pending delivery">Pending Delivery</option>
                </select>

                {showServiceSelect && (
                  <select
                    className="mt-2 px-4 py-2 border rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedServiceForMultiple|| ""}
                    onChange={(e) => {
                      const service = e.target.value;
                      if (!service) return;

                      setSelectedServiceForMultiple(service);
                      Swal.fire({
                        title: `Deliver orders with ${service}?`,
                        icon: "question",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          handlePendingDeliveries(service);
                        }
                        setShowServiceSelect(false);
                        setSelectedAction(""); 
                        fetchOrders(filters); 

                      });
                    }}
                  >
                    <option value="">Select Service</option>
                    {services.map((service,index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                )}
              </motion.div>

              {filtersOn && (
                <div
                  className="fixed bg-black inset-0 bg-opacity-50 flex flex-col items-center z-50"
                  onClick={() => setFiltersOn(false)}
                >
                  <div
                    className="bg-white mt-6 p-6 rounded-lg shadow-xl w-full max-w-md h-[600px]
 overflow-y-auto "
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <IoIosCloseCircle
                      className="text-lg cursor-pointer hover:opacity-[90%]"
                      onClick={() => setFiltersOn(false)}
                    />
                    <div className="flex flex-col gap-4 mt-4">
                      <h2 className="text-lg font-semibold">
                        Filter by Status
                      </h2>
                      <div className="grid grid-cols-2 gap-2">
                        {statuses.map((status, index) => (
                          <div key={status} className="flex items-center gap-2">
                            <input
                              type="radio"
                              id={status}
                              name="status" // same name for all radio buttons
                              value={status}
                              checked={filters.status === status}
                              onChange={(e) => {
                                const selectedStatus = e.target.value;
                                changeStatusFilter(selectedStatus);
                              }}
                              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label
                              htmlFor={status}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                      <hr className="my-2" />
                      <h2 className="text-lg font-semibold">From date</h2>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          onChange={(e) => changeFromDateFilter(e.target.value)}
                          className="
    p-2 
    rounded 
    border 
    border-gray-300 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-transparent
    w-full
    text-gray-700
  "
                        />{" "}
                      </div>
                      <h2 className="text-lg font-semibold">To date</h2>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          onChange={(e) => changeToDateFilter(e.target.value)}
                          className="
    p-2 
    rounded 
    border 
    border-gray-300 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-transparent
    w-full
    text-gray-700
  "
                        />{" "}
                      </div>
                      <hr className="my-2" />
                      <h2 className="text-lg font-semibold">Filter by Store</h2>
                      <label htmlFor="">Choose a store</label>
                      <select
                        className="
    p-2 
    rounded 
    border 
    border-gray-300 
    bg-white
    shadow-sm
    text-gray-700
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-transparent
    transition-all
    duration-150
    ease-in-out
    cursor-pointer
  "
                        value={filters.store || "Select Store"}
                        onChange={(e) => {
                          const selectedStore = e.target.value;
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            store: selectedStore,
                          }));
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <option value="Select Store" disabled>
                          Select Store
                        </option>
                        {stores.map((store) => (
                          <option key={store.id} value={store.name}>
                            {store.name}
                          </option>
                        ))}
                      </select>
                      <hr className="my-2" />
                      <h2 className="text-lg font-semibold">
                        Filter by government
                      </h2>
                      <label htmlFor="">Choose a government</label>
                      <select
                        className="
    p-2 
    rounded 
    border 
    border-gray-300 
    bg-white
    shadow-sm
    text-gray-700
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-transparent
    transition-all
    duration-150
    ease-in-out
    cursor-pointer
  "
                        value={filters.address || "Gov"}
                        onChange={(e) => {
                          const selectedGov = e.target.value;
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            address: selectedGov,
                          }));
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <option value="Gov" disabled>
                          Select government
                        </option>{" "}
                        {/* Changed to value="" */}
                        {governments.map((Gov) => (
                          <option key={Gov.id} value={Gov.name}>
                            {Gov.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="px-4  py-2 bg-blue-600 text-white font-bold w-full mt-4 hover:opacity-[90%]"
                      onClick={() => {
                        setFiltersOn(false);
                        fetchOrders(filters);
                        setCurrentPage(1);
                        setFilters({
                          status: [],
                          date: [],
                          store: "",
                          address: "",
                        });
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                Showing {Math.min(currentPage * itemsPerPage, orders.length)} of{" "}
                {orders.length} orders
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
                  New: NewOrderActions,
                  "pending delivery": PendingDeliveryActions,
                  "In Transit": InTransitOrderActions,
                  "pending preparation": pendingPreparationOrderActions,
                  Cancelled: canceledOrderActions,
                  hold: holdActionOrderActions,
                  "In preparation": inPreparationOrderActions,
                  Delivered: deliveredActionOrderActions,
                  Returned: ReturnedActionOrderActions,
                  "Partially Delivered": PartiallyDeliveredActionOrderActions,
                  Complete: completeActionOrderActions,
                  "ready for shipment": readyForShipmentActionOrderActions,
                }}
                cardClickable={true}
                handleUpdateOrder={handleUpdateOrder}
                cancelOrder={cancelOrder}
                handlePendingDelivery={handlePendingDelivery}
                confirmOrder={confirmOrder}
                holdOrder={holdOrder}
                invoiceOrder={invoiceOrder}
                shippingServices={services}
                isAdmin={isAdmin}
                setSelectedService={setSelectedService}
                isSelectAll={select}
                isSelected={selectedOrders.includes(item.id)}
                onToggleSelect={() => handleToggleSelect(item.id)}
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

            {Array.from(
              { length: end - start + 1 },
              (_, index) => start + index
            ).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
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
            {
              label: "Cancel",
              onClick: () => setPopupData(null),
              type: "secondary",
            },
            {
              label: "Save",
              onClick: () => {
                updateCartOrOrder === "update order"
                  ? handleSaveChanges()
                  : handleUpdateCart();
              },
              type: "primary",
            },
          ]}
        >
          <div className="flex flex-col gap-1">
            <div className="flex gap-4 items-center justify-center">
              <span
                className={`${
                  updateCartOrOrder === "update order" ? activePopupWindow : ""
                } transition-all cursor-pointer`}
                onClick={() => setUpdateCartOrOrder("update order")}
              >
                update order data
              </span>
              <span
                className={`${
                  updateCartOrOrder === "update cart" ? activePopupWindow : ""
                } transition-all cursor-pointer`}
                onClick={() => setUpdateCartOrOrder("update cart")}
              >
                update cart
              </span>
            </div>
            {updateCartOrOrder === "update order" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-300">Order ID</label>
                    <input
                      value={popupData.id}
                      onChange={(e) => {
                        e.preventDefault();
                      }}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-300">Total</label>
                    <input
                      type="number"
                      value={popupData.total}
                      onChange={(e) =>
                        setPopupData({ ...popupData, total: e.target.value })
                      }
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400">
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300">Name</label>
                      <input
                        value={popupData.customer.name}
                        onChange={(e) =>
                          setPopupData({
                            ...popupData,
                            customer: {
                              ...popupData.customer,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300">Phone</label>
                        <input
                          value={popupData.customer.phoneNumber}
                          onChange={(e) =>
                            setPopupData({
                              ...popupData,
                              customer: {
                                ...popupData.customer,
                                phoneNumber: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-300">Email</label>
                        <input
                          value={popupData.customer.email}
                          onChange={(e) =>
                            setPopupData({
                              ...popupData,
                              customer: {
                                ...popupData.customer,
                                email: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-300">Address</label>
                      <input
                        value={popupData.customer.address}
                        onChange={(e) =>
                          setPopupData({
                            ...popupData,
                            customer: {
                              ...popupData.customer,
                              address: e.target.value,
                            },
                          })
                        }
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
                      (popupData.updatedCart || []).forEach((updatedItem) => {
                        const index = mergedCart.findIndex(
                          (item) => item.productId === updatedItem.productId
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
                            const product = items.find(
                              (i) => i.id === Number(item.productId)
                            );
                            return (
                              <div
                                key={index}
                                className="border-b border-slate-500 pb-2"
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {product?.name || "Unknown Product"}
                                  </span>
                                  <span>x{item.quantity}</span>
                                </div>
                                <div className="flex justify-between text-slate-300">
                                  <span>Price: ${item.price.toFixed(2)}</span>
                                  <span>
                                    Total: $
                                    {(item.quantity * item.price).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                          <p className="text-lg pt-4 border-t border-slate-500">
                            <span className="font-medium">Total:</span>$
                            {mergedCart
                              .reduce(
                                (sum, item) => sum + item.quantity * item.price,
                                0
                              )
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
                          const existingItem = popupData.updatedCart?.find(
                            (item) => Number(item.productId) === productId
                          );

                          setSelectedProduct(productId);
                          if (existingItem) {
                            setCurrentQty(existingItem.quantity);
                            setCurrentPrice(existingItem.price);
                          } else {
                            setCurrentQty(1);
                            setCurrentPrice(
                              items.find((i) => i.id === productId)?.price || 0
                            );
                          }
                        }}
                      >
                        <option value="" disabled>
                          Select Product
                        </option>
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
                        <label className="mb-1 block font-medium">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={currentQty}
                          onChange={(e) =>
                            setCurrentQty(
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
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
                          onChange={(e) =>
                            setCurrentPrice(parseFloat(e.target.value) || 0)
                          }
                          className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                      onClick={() => {
                        if (!selectedProduct) return;

                        const product = items.find(
                          (i) => i.id === selectedProduct
                        );

                        const newItem = {
                          productId: selectedProduct,
                          name: product?.name || "Unknown Product",
                          quantity: currentQty,
                          price: currentPrice,
                        };

                        setPopupData((prev) => {
                          const filteredCart = (prev.cart || []).filter(
                            (item) => item.productId !== selectedProduct
                          );

                          const existingIndex =
                            prev.updatedCart?.findIndex(
                              (item) =>
                                Number(item.productId) === selectedProduct
                            ) ?? -1;

                          const newCart = [...(prev.updatedCart || [])];

                          if (existingIndex > -1) {
                            newCart[existingIndex] = newItem;
                          } else {
                            newCart.push(newItem);
                          }

                          return {
                            ...prev,
                            cart: filteredCart,
                            updatedCart: newCart,
                            total: [...filteredCart, ...newCart].reduce(
                              (sum, item) => sum + item.quantity * item.price,
                              0
                            ),
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
            )}
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
            { label: "Confirm", onClick: handleSaveCode, type: "primary" },
          ]}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-300">Confirmation Code</label>
              <input
                value={completePopupData.code}
                onChange={(e) =>
                  setCompletePopupData({
                    ...completePopupData,
                    code: e.target.value,
                  })
                }
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
