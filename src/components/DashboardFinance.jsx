import { DollarSign, ShoppingBasketIcon } from 'lucide-react';
import React, { useEffect, useRef, useState} from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { motion } from "framer-motion";
import { MdMoney } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import useInView from "@/Hooks/useInView"; 
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Popup from './Popup';
import { Select } from '@mui/material';

const API = import.meta.env.VITE_API;
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardFinance = () => {
    const [timeInterval, setTimeInterval] = useState('year');
    const [earningData, setEarningData] = useState([]);
    const [total, setTotal] = useState(0);
    const [TopOrders , setTopOrders] = useState([]);

    const [EarningGroupBy , setEarningGroupBy ] = useState("year");

    const [barChartData, setBarChartData] = useState([
        { month: 'Jan', sales: 15000, netProfit: 5000 },
        { month: 'Feb', sales: 12000, netProfit: 4000 },
        { month: 'Mar', sales: 18000, netProfit: 7000 },
        { month: 'Apr', sales: 20000, netProfit: 8000 },
        { month: 'May', sales: 17000, netProfit: 6000 },
        { month: 'Jun', sales: 19000, netProfit: 7500 },
        { month: 'Jul', sales: 22000, netProfit: 9000 },
    ]);

    const [products, setProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stores, setStores] = useState([]);

    const [newCustomers, setNewCustomers] = useState("1900");
    const [customers, setCustomers] = useState({});
    const [ordersCard, setOrdersCard] = useState("1900");
    const [sales, setSales] = useState("1900");
    const [product, setProduct] = useState([]);
    const [shipping, setShipping] = useState({});    
    const [deliveredOrders, setDeliveredOrders] = useState({});
    const [netProfit, setNetProfit] = useState({});
    const [newOrders, setnewOrders] = useState({});
    const [deliverdOrders, setDeliverdOrders] = useState({});
    const [recentCustomers, setrecentCustomers] = useState({});
    const [allNewCustomers, setallNewCustomers] = useState({});
    const [productSales, setProductSales] = useState({});



    const fetchData = async (endpoint, setter) => {
        try {
            const target = `${API}${endpoint}`;
            const resp = await fetch(target);
            const data = await resp.json();
            console.log(data);
            console.log(endpoint);
            
            setter(data);
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
        }
    };

    useEffect(() => {
        fetchData(`Data/finances?groupBy=${EarningGroupBy}`, setEarningData);
        fetchData('Data/products', setProducts);
        fetchData('Data/low-stock', setLowStock);
        fetchData('Data/orders', setOrders);
        fetchData('Data/stores', setStores);
        fetchData('Orders/top-5', setTopOrders);
        fetchData(`reports/new-customers?groupBy=${timeInterval}`, setNewCustomers);
        fetchData(`reports/customers?groupBy=${timeInterval}`,setCustomers);
        fetchData(`reports/orders?groupBy=${timeInterval}`, setOrdersCard);
        fetchData(`reports/total-sales?groupBy=${timeInterval}`, setSales);
        fetchData(`reports/products?groupBy=${timeInterval}`, setProduct);
        fetchData(`reports/shipping-items`, setShipping);
        fetchData(`reports/delivered-orders?groupBy=${timeInterval}`, setDeliveredOrders);
        
        // fetchData(`reports/net-profit?groupBy=${timeInterval}`, setNetProfit);

        
        fetchData(`reports/new-orders?groupBy=${timeInterval}`, setnewOrders);
        fetchData(`reports/recent-customers?groupBy=${timeInterval}`, setrecentCustomers);
        fetchData(`reports/all-new-customers?groupBy=${timeInterval}`, setallNewCustomers);
        fetchData(`reports/all-delivered-orders?groupBy=${timeInterval}`, setDeliverdOrders);
        fetchData(`reports/product-sales?groupBy=${timeInterval}`, setProductSales);
        
    }, [timeInterval , EarningGroupBy]);

    useEffect(() => {
        const tempTotal = earningData.reduce((acc, item) => acc + item.value, 0);
        setTotal(tempTotal);
    }, [earningData]);

    // Pie chart data
    const storesNames = [] ;
    const storesRevenue = [] ;
    stores.forEach((ele)=>{
        storesNames.push(ele.store);
        storesRevenue.push(ele.revenue);
    })
    const pieData = {
        labels: storesNames,
        datasets: [
            {
                label: 'Order Revenue by Store',
                data: storesRevenue,
                borderWidth: 1,
            },
        ],
    };
    const barData = {
    labels: barChartData.map((item) => item.month),
    datasets: [
        {
            label: 'Sales',
            data: barChartData.map((item) => item.sales),
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return null;
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(128, 0, 128, 0.7)'); // Dark purple
                gradient.addColorStop(1, 'rgba(147, 112, 219, 0.7)'); // Light purple
                return gradient;
            },
            borderColor: 'rgba(128, 0, 128, 1)',
            borderWidth: 1,
            borderRadius: 5,
            barThickness: 30,
        },
        {
            label: 'Net Profit',
            data: barChartData.map((item) => item.netProfit),
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return null;
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(0, 128, 128, 0.7)'); // Dark teal
                gradient.addColorStop(1, 'rgba(32, 178, 170, 0.7)'); // Light teal
                return gradient;
            },
            borderColor: 'rgba(0, 128, 128, 1)',
            borderWidth: 1,
            borderRadius: 5,
            barThickness: 30,
        },
    ],
};

    
    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#4B5563',
                    font: {
                        size: 14,
                        family: 'Poppins, sans-serif',
                    },
                },
            },
            title: {
                display: true,
                text: 'Earnings Overview',
                color: '#1F2937',
                font: {
                    size: 18,
                    family: 'Poppins, sans-serif',
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Hide x-axis grid lines
                },
                ticks: {
                    color: '#4B5563', // Dark gray color for x-axis labels
                    font: {
                        size: 12,
                        family: 'Poppins, sans-serif',
                    },
                },
            },
            y: {
                grid: {
                    color: '#E5E7EB', // Light gray color for y-axis grid lines
                },
                ticks: {
                    color: '#4B5563', // Dark gray color for y-axis labels
                    font: {
                        size: 12,
                        family: 'Poppins, sans-serif',
                    },
                },
            },
        },
    };
    const performanceData = [
        {
            title: 'New Customers',
            value: newCustomers,
            icon: <FaUserFriends className="w-12 h-12 text-indigo-200" />,
            color: 'from-blue-500 to-indigo-500' , 
            popupValues :allNewCustomers ,
            tableHeader : ["id" , "name" , "email" , "address" , "phoneNumber"]
        },
        {
            title: 'Customers',
            value: customers,
            icon: <DollarSign className="w-12 h-12 text-yellow-200" />,
            color: 'from-yellow-500 to-orange-500' ,
            popupValues : recentCustomers,
            tableHeader : ["id" , "name" , "email" , "address" , "phoneNumber"]
        },
        {
            title: 'Orders',
            value: ordersCard,
            icon: <MdMoney className="w-12 h-12 text-green-200" />,
            color: 'from-green-500 to-teal-500',
            popupValues : newOrders , 
            tableHeader : ["customer name" , "email" , "phoneNumber" , "status" , "total"] ,
        },
        {
            title: 'Products',
            value: product,
            icon: <ShoppingBasketIcon className="w-12 h-12 text-purple-200" />,
            color: 'from-purple-500 to-pink-500',
            popupValues : productSales.items ,
            tableHeader : ["SKU" , "product" , "sold"] ,
        },
        {
            title: 'In Shipping',
            value: shipping,
            icon: <FaUserFriends className="w-12 h-12 text-indigo-200" />,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            title: 'Delivered Orders',
            value: deliveredOrders,
            icon: <MdMoney className="w-12 h-12 text-green-200" />,
            color: 'from-green-500 to-teal-500',
            popupValues : deliverdOrders , 
            tableHeader : ["customer name" , "email" , "phoneNumber" , "status" , "total"] ,
        },
        {
            title: 'Revenue',
            value: sales,
            icon: <DollarSign className="w-12 h-12 text-yellow-200" />,
            color: 'from-yellow-500 to-orange-500'
        },
        {
            title: 'Net Profit',
            value: "0000",
            // value: netProfit,
            icon: <ShoppingBasketIcon className="w-12 h-12 text-purple-200" />,
            color: 'from-purple-500 to-pink-500'
        }
    ];
    
    
    const earningSectionRef = useRef(null);
    const barChartRef = useRef(null);
    const lowStockRef = useRef(null);
    const sectionRef = useRef(null);

    const isEarningVisible = useInView(earningSectionRef, { threshold: 0.2 });
    const isBarChartVisible = useInView(barChartRef, { threshold: 0.28 });
    const isLowStockVisible = useInView(lowStockRef, { threshold: 0.2 });
    const isVisible = useInView(sectionRef, { threshold: 0.2 });
    
    const [isCapturing, setIsCapturing] = useState(false);
    
    const downloadData = async () => {
        setIsCapturing(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
    
        const dashboard = document.getElementById("dashboard-content");
        if (!dashboard) return;
    
        try {
            const canvas = await html2canvas(dashboard, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
    
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const pageHeight = 297; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
              }

            pdf.save("dashboard_report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
        finally{
            setIsCapturing(false);
        }
    };
    
    
    return (
        <div id="dashboard-content" className={`min-h-screen bg-gray-100 p-6 mt-14 md:mt-0 ${isCapturing && 'animate-pulse'} `}>
            <div className="container mx-auto space-y-6">
                {/* Time Interval Selector */}
                <div className="flex justify-end mb-6">
                    <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2">
                        {['day', 'week', 'month', 'year'].map((interval) => (
                            <button
                                key={interval}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    timeInterval === interval
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                onClick={() => setTimeInterval(interval)}
                            >
                                {interval.charAt(0).toUpperCase() + interval.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preformance Section */}
                <motion.div
                    ref={sectionRef}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
                    initial={isCapturing ? false : { opacity: 0, scale: 0.95 }}
                    animate={ isCapturing ? { opacity: 1, scale: 1} : isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={isCapturing ? { duration: 0 } : { duration: 0.8 }}
                >
                    {performanceData.map((item, index) => (
                        <motion.div
                            onClick={()=>{
                                localStorage.setItem( "performanceData" , JSON.stringify({
                                    ...item , 
                                    icon : ""
                                }));
                                window.open(`/performance-details/${index}`);
                            }}
                            key={index}
                            className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-r ${item.color} flex items-center gap-4`}
                            initial={isCapturing ? false : { opacity: 0, y: 20 }}
                            animate={isCapturing ? { opacity: 1, y: 0 } : isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={isCapturing ? { duration: 0 ,delay: 0} : { duration: 0.6, delay: index * 0.2 }}
                            >
                            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">{item.title}</span>
                                <span className="text-2xl font-bold">{item.value.total}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                {/* Recent Orders */}
                {/* Orders Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Top 5 Orders</h3>
                    {TopOrders.length > 0 ? (
                        <div className="overflow-x-auto h-64 overflow-y-auto">
                            <table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden shadow-lg">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-gray-600 font-semibold">Order ID</th>
                                        <th className="px-4 py-2 text-gray-600 font-semibold">Customer</th>
                                        <th className="px-4 py-2 text-gray-600 font-semibold">Total</th>
                                        <th className="px-4 py-2 text-gray-600 font-semibold">Status</th>
                                        <th className="px-4 py-2 text-gray-600 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TopOrders.map((order, index) => (
                                        <tr
                                            key={index}
                                            className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td className="px-4 py-2">{order.id}</td>
                                            <td className="px-4 py-2">{order.customer}</td>
                                            <td className="px-4 py-2 font-semibold text-green-600">EGP {order.total}</td>
                                            <td className={`px-4 py-2 font-medium text-indigo-700`}> {order.status} </td>
                                            <td className="px-4 py-2">{new Date(order.orderTime).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No orders found.</p>
                    )}
                </div>

                {/* Earnings Section */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    <motion.div
                    ref={earningSectionRef}
                    className="bg-white rounded-xl shadow-md p-6 space-y-6"
                    initial={isCapturing ? false :{ opacity: 0, y: 20 }}
                    animate={isCapturing ? { opacity: 1, y: 0} : isEarningVisible ? { opacity: 1, y: 0 } : {} }
                    transition={isCapturing ? { duration: 0 } : { duration: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg px-4 py-2 md:p-6 shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold">Earnings</h2>
                                    <p className="text-2xl md:text-4xl font-extrabold mt-2">{total}EGP </p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <select
                                        className="p-2 rounded-md bg-transparent border text-white"
                                        value={EarningGroupBy}
                                        onChange={(e)=>{setEarningGroupBy(e.target.value)}}
                                    >
                                    {['day', 'week', 'month', 'year'].map((ele) => (
                                        <option className="bg-black" key={ele} value={ele}>
                                            {ele}
                                        </option>
                                    ))}
                                    </select>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={downloadData}
                                        className="bg-white text-indigo-500 px-4 md:px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200"
                                    >
                                        Download
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Earnings Data Table */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Earnings Breakdown</h3>
                        {earningData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-left border-collapse rounded-lg overflow-hidden shadow-lg">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 text-gray-600 font-semibold">ID</th>
                                            <th className="px-4 py-2 text-gray-600 font-semibold">Name</th>
                                            <th className="px-4 py-2 text-gray-600 font-semibold">Value</th>
                                            <th className="px-4 py-2 text-gray-600 font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {earningData.map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                            >
                                                <td className="px-4 py-2">{item.id}</td>
                                                <td className="px-4 py-2">{item.name}</td>
                                                <td className="px-4 py-2 text-green-600 font-semibold">EGP {item.value}</td>
                                                <td className="px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500">No data available.</p>
                        )}
                    </div>
                </div>


                {/* barchart */}
                <motion.div
                    ref={barChartRef}
                    className="bg-white rounded-xl shadow-md p-6"
                    initial={isCapturing ? false :{ opacity: 0, scale: 0.9 }}
                    animate={isCapturing ? {opacity:1 , scale:1} : isBarChartVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={isCapturing ? {duration:0,delay: 0} : { duration: 0.6, delay: 0.3 }}
                >
                    <h3 className="text-xl font-semibold mb-4">Monthly Earnings Overview</h3>
                    <div className="h-72">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </motion.div>

                {/* Products Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Top Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl shadow-lg p-4">
                                <img
                                    src={product.image || "https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dwdc4fbc47/Y0998004/Y0998004_C099600455_E03_GHC.jpg?sw=800"}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h4 className="text-lg font-semibold">{product.name}</h4>
                                <p className="text-sm text-gray-500">revenue: {product.revenue}</p>
                                <p className="text-lg font-bold text-indigo-600">EGP {product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Section */}
                <motion.div
                ref={lowStockRef}
                className="bg-white rounded-xl shadow-md p-6"
                initial={isCapturing ? false :{ x: -50, opacity: 0 }}
                animate={isCapturing ? { x: 0, opacity: 1 } :isLowStockVisible ? { x: 0, opacity: 1 } :{}}
                transition={isCapturing ? { duration: 0 , delay: 0} : { duration: 0.5, delay: 0.6 }}
                >
                    <h3 className="text-xl font-semibold mb-4">Low Stock Products</h3>
                    <ul className="space-y-4">
                        {lowStock.map((item, index) => (
                            <motion.li
                                key={index}
                                className="flex justify-between items-center bg-red-100 p-4 rounded-lg"
                                initial={isCapturing ? false :{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={isCapturing?{ delay: index * 0 } : { delay: index * 0.1 }}
                            >
                                <span className="font-medium text-red-600">{item.name}</span>
                                <span className="text-sm">Available: {item.available}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Orders Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Stores Overview</h3>
                    <p className="text-3xl font-bold mb-4">Total Revenue: EGP {orders.reduce((acc, item) => acc + item.revenue, 0)}</p>
                        {/* Pie Chart for Orders Overview */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Orders Overview by Store</h3>
                            <div className="h-72">
                                <Pie data={pieData} />
                            </div>
                        </div>
                </div>
            </div>
            {
                // preformancePopup && (
                //     <Popup
                //     width='w-[80vw]'
                //         title={""}
                //         onClose={()=>{setPreformancePopup(false)}}
                //     >
                //         {
                //             preformancePopupData < 2 && (
                //                 <div className='max-h-[80vh] overflow-y-auto'>
                //                     {
                //                         <table className="min-w-full table-auto text-sm text-left overflow-y-auto border border-gray-700">
                //                         <thead className="bg-gray-800 text-gray-200">
                //                             <tr>
                //                                 {performanceData[preformancePopupData].tableHeader.map((ele, i) => (
                //                                     <th key={i} className="px-6 py-3 border-b border-gray-700 font-bold text-center uppercase tracking-wide">
                //                                         {ele}
                //                                     </th>
                //                                 ))}
                //                             </tr>
                //                         </thead>
                //                         <tbody>
                //                             {performanceData[preformancePopupData].popupValues.map((ele, i) => (
                //                                 <tr key={i} className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-all">
                //                                     {performanceData[preformancePopupData].tableHeader.map((header, index) => (
                //                                         <td key={index} className="px-6 py-3 text-center text-gray-300">
                //                                             {ele[header]}
                //                                         </td>
                //                                     ))}
                //                                 </tr>
                //                             ))}
                //                         </tbody>
                //                     </table>
                                    
                //                     }
                //                 </div>
                //             ) 
                //         }
                //         {
                //             (preformancePopupData == 2 || preformancePopupData == 5 )&& (
                                
                //                 <div className="p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg">
                //                 <h2 className="text-lg font-bold mb-4">Orders</h2>
                                
                //                 {/* Orders Table */}
                //                 <table className="min-w-full table-auto text-sm text-left border border-gray-700 overflow-y-auto">
                //                     <thead className="bg-gray-800 text-gray-200">
                //                         <tr>
                //                             {
                //                                 console.log(performanceData[preformancePopupData].tableHeader)
                //                             }
                //                             {performanceData[preformancePopupData].tableHeader.map((header, i) => (
                //                                 <th key={i} className="px-6 py-3 border-b border-gray-700 font-bold text-center uppercase">
                //                                     {header}
                //                                 </th>
                //                             ))}
                //                         </tr>
                //                     </thead>
                //                     <tbody>
                //                         {
                //                                 console.log(performanceData[preformancePopupData].popupValues)
                //                         }
                //                         {performanceData[preformancePopupData].popupValues.map((order, i) => (
                //                             <tr key={i} className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-all">
                //                                 <td className="px-6 py-3 text-center">{order.customer.name || "N/A"}</td>
                //                                 <td className="px-6 py-3 text-center">{order.customer.email || "N/A"}</td>
                //                                 <td className="px-6 py-3 text-center">{order.customer.phoneNumber || "N/A"}</td>
                //                                 <td className="px-6 py-3 text-center">{order.status || "N/A"}</td>
                //                                 <td className="px-6 py-3 text-center">{order.total || "N/A"}</td>
                //                             </tr>
                //                         ))}
                //                     </tbody>
                //                 </table>

                                
                //             </div>

                //             )
                //         }
                //         {
                //              preformancePopupData == 3 && (
                //                 <div className="p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg">
                //                 <h2 className="text-lg font-bold mb-4">Products</h2>
                                
                //                 {/* Orders Table */}
                //                 <table className="min-w-full table-auto text-sm text-left border border-gray-700 overflow-y-auto">
                //                     <thead className="bg-gray-800 text-gray-200">
                //                         <tr>
                //                             {
                //                                 console.log(performanceData[preformancePopupData].tableHeader)
                //                             }
                //                             {performanceData[preformancePopupData].tableHeader.map((header, i) => (
                //                                 <th key={i} className="px-6 py-3 border-b border-gray-700 font-bold text-center uppercase">
                //                                     {header}
                //                                 </th>
                //                             ))}
                //                         </tr>
                //                     </thead>
                //                     <tbody>
                //                         {
                //                                 console.log(performanceData[preformancePopupData].popupValues)
                //                         }
                //                         {performanceData[preformancePopupData].popupValues.map((p, i) => (
                //                             <tr key={i} className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-all">
                //                                 <td className="px-6 py-3 text-center">{p.sku || "N/A"}</td>
                //                                 <td className="px-6 py-3 text-center">{p.product || "N/A"}</td>
                //                                 <td className="px-6 py-3 text-center">{p.sold || "N/A"}</td>
                //                             </tr>
                //                         ))}
                //                     </tbody>
                //                 </table>

                                
                //             </div>
                //              )
                //         }
                //     </Popup>
                // )
            }
        </div>
    );
};

export default DashboardFinance;