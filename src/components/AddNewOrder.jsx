import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import { z } from "zod";
import { motion } from 'framer-motion';
import governorates from "@/Data/governorates.js"
import cities from "@/Data/cities.js"

const API = import.meta.env.VITE_API;

const itemSchema = z.object({
  username: z.string().min(1, "Username is required"),
  phonenumber: z.string().min(1, "Phone number is required"),
  whatsapp : z.nullable(z.string()) ,
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  province : z.string().min(1, "governorat is required"),
  city : z.string().min(1, "city is required"), 
  items: z.array(
    z.object({
      sku: z.string().min(1, "SKU is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one product is required"),
});

const AddNewOrder = () => {
  const [formData, setFormData] = useState({
    username: "",
    phonenumber: "",
    whatsapp : null ,
    email: "",
    address: "",
    items: [],
    city : "" , 
    province : "",
  });

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [ prices ,setPrices] = useState({});
  const [totalPrice , setTotalPrice] = useState(0);
  
  
  const governorateOptions = governorates[2].data;
  const cityOptions = cities[2].data; 

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'province') {
      setFormData(prev => ({ ...prev, [name]: value, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (sku, value) => {
    setQuantities(prev => ({
      ...prev,
      [sku]: Math.max(0, parseInt(value) || 0)
    }));
  };

   useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}Item`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
        setPrices((prev) => {
          const updatedPrices = {};
          response.data.forEach((product) => {
            updatedPrices[product.sku] = product.price;
          });
          return updatedPrices;
        });
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handlePriceCahnge = (sku, value) => {
    setPrices((prev) => {
      const updatedPrices = {
        ...prev,
        [sku]: Math.max(0, parseFloat(value) || 0),
      };
      console.log(updatedPrices[sku]); // Log the updated price immediately
      return updatedPrices;
    });
  };

  const addProductToOrder = (product) => {
    const quantity = quantities[product.sku] || 0;
    const price = prices[product.sku] || 0;
    if (quantity < 1) return;
  
    setFormData(prev => {
      const updatedItems = [
        ...prev.items.filter(item => item.sku !== product.sku),
        { sku: product.sku, quantity, price },
      ];
  
      return {
        ...prev,
        items: updatedItems,
      };
    });
  
    setQuantities(prev => ({ ...prev, [product.sku]: 0 }));
    setPrices(prev => ({ ...prev, [product.sku]: 0 }));
  };

  const removeItem = (sku) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.sku !== sku)
    }));
  };
const calculateTotalPrice = () => {
  return formData.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};
  const addOrder = async (e) => {
    e.preventDefault();
    try {
      const parsedData = itemSchema.parse({
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          quantity: Number(item.quantity)
        }))
      });

      const orderData = {
        customer: {
          username: parsedData.username,
          phonenumber: parsedData.phonenumber,
          whatsapp : parsedData.whatsapp ,
          email: parsedData.email,
        },
        default_address: { address1: parsedData.address , city : parsedData.city , province : parsedData.province ,},
        line_Items: parsedData.items,
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(`${API}orders/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if ([200, 201].includes(response.status)) {
        toast.success("Order created successfully!");
        setFormData({
          username: "",
          phonenumber: "",
          whatsapp : null, 
          email: "",
          address: "",
          province : "", 
          city : "", 
          items: [],
        });
        setQuantities({});
      }
    } catch (error) {
      console.log(error);
      toast.error(`there is error Now `)
    }
  };

  return (
    <Center className="bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <motion.div
        className="flex flex-col md:flex-row gap-8 w-full max-w-6xl max-h-[88vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Customer Form */}
        <motion.form
          onSubmit={addOrder}
          className="md:w-1/2 max-h-[95vh] overflow-y-auto bg-gray-800 rounded-xl p-6 shadow-2xl scrollbar-track-slate-500 scrollbar-thumb-slate-800 scrollbar-thin"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
            Create New Order
          </h2>

          <div className="flex flex-col gap-4">
            {['username', 'phonenumber' , "whatsapp", 'email', 'address'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-gray-300 capitalize">{field.replace('number', ' number')}</label>
                <input
                  name={field}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white
                    focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={formData[field]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <div className="flex gap-4">
              <div className="space-y-2 w-1/2">
                <label className="text-gray-300">Governorate</label>
                <select
                  name="province"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.province}
                  onChange={handleInputChange}
                >
                  <option value="">Select Governorate</option>
                  {governorateOptions.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {gov.governorate_name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 w-1/2">
                <label className="text-gray-300">City</label>
                <select
                  name="city"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!formData.province}
                >
                  <option value="">Select City</option>
                  {cityOptions
                    .filter(city => city.governorate_id === formData.province)
                    .map(city => (
                      <option key={city.id} value={city.city_name_en}>
                        {city.city_name_en}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* Selected Items */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-200">Selected Products</h3>
              {formData.items.length === 0 ? (
                <p className="text-gray-400">No products selected yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {formData.items.map((item) => {
                    const product = products.find(p => p.sku === item.sku);
                    return (
                      <div key={item.sku} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <div>
                          <p className="text-gray-200">{product?.name}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-400">Price: {item.price}</p>
                          <p className="text-sm text-gray-400">Total : {calculateTotalPrice()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(item.sku) ;
                            setTotalPrice((prev)=>prev - (item.quantity * item.price))
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <p className="text-white text-xl font-bold">Total : {totalPrice}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg
                text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Create Order
            </button>
          </div>
        </motion.form>

        {/* Product Selection */}
        <motion.div
          className="md:w-1/2 bg-gray-800 rounded-xl p-6 shadow-2xl max-h-[70vh] md:max-h-[90vh] overflow-y-auto scrollbar-track-slate-500 scrollbar-thumb-slate-800 scrollbar-thin"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
        >
          <h3 className="text-xl font-semibold text-gray-200 mb-6">Available Products</h3>
          <div className="grid grid-cols-1 gap-4 pr-2">
            {products.map((product) => (
              <div key={product.sku} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-gray-200 font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-400">SKU: {product.sku}</p>
                    <p className="text-sm text-blue-300">Available: {product.quantity}</p>
                  </div>
                  <div className="flex  items-center gap-2">

                    <div className="flex flex-col gap-1">
                      <label htmlFor="quantitie" className="text-white">Quantities</label>
                      <input
                        name="quantitie"
                        type="number"
                        min="0"
                        value={quantities[product.sku] || 0}
                        onChange={(e) => handleQuantityChange(product.sku, e.target.value)}
                        className="w-20 px-2 py-1 bg-gray-600 text-white rounded-md text-center"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="price" className="text-white">Price</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={prices[product.sku] ||product.price}
                        onChange={(e) => handlePriceCahnge(product.sku, e.target.value)}
                        className="w-20 px-2 py-1 bg-gray-600 text-white rounded-md text-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addProductToOrder(product);
                        setTotalPrice((prev)=>prev + (prices[product.sku] * quantities[product.sku]) )
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Center>
  );
};

export default AddNewOrder;