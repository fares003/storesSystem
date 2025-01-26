import { BoxesIcon, DollarSign, ShoppingBasketIcon } from 'lucide-react';
import React, { useEffect, useRef, useState} from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { motion } from "framer-motion";
import { GoDotFill } from "react-icons/go";
import { MdMoney } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import useInView from "@/Hooks/useInView"; 

const API = import.meta.env.VITE_API;
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashboardFinance = () => {
    const [earningData, setEarningData] = useState([]);
    const [total, setTotal] = useState(0);
    const [barChartData, setBarChartData] = useState([
        { month: 'Jan', value: 15000 },
        { month: 'Feb', value: 12000 },
        { month: 'Mar', value: 18000 },
        { month: 'Apr', value: 20000 },
        { month: 'May', value: 17000 },
        { month: 'Jun', value: 19000 },
        { month: 'Jul', value: 22000 },
    ]);

    const [products, setProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stores, setStores] = useState([]);

    const fetchData = async (endpoint, setter) => {
        try {
            const target = `${API}${endpoint}`;
            const resp = await fetch(target);
            const data = await resp.json();
            setter(data);
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
        }
    };

    useEffect(() => {
        fetchData('Data/finances', setEarningData);
        fetchData('Data/products', setProducts);
        fetchData('Data/low-stock', setLowStock);
        fetchData('Data/orders', setOrders);
        fetchData('Data/stores', setStores);
    }, []);

    useEffect(() => {
        const tempTotal = earningData.reduce((acc, item) => acc + item.value, 0);
        setTotal(tempTotal);
    }, [earningData]);

    // Pie chart data
    const pieData = {
        labels: ['Store A', 'Store B', 'Store C'], // Static store names
        datasets: [
            {
                label: 'Order Revenue by Store',
                data: [3000, 4500, 2300], // Static revenue data for each store
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',  // Red
                    'rgba(54, 162, 235, 0.7)',  // Blue
                    'rgba(255, 206, 86, 0.7)'   // Yellow
                ], // Static colors for each store
                borderWidth: 1,
            },
        ],
    };
    const barData = {
        labels: barChartData.map((item) => item.month),
        datasets: [
            {
                label: 'Monthly Earnings',
                data: barChartData.map((item) => item.value),
                backgroundColor: 'rgba(79, 209, 197, 0.8)',
                borderColor: 'rgba(47, 128, 237, 1)',
                borderWidth: 2,
            },
        ],
    };

    const barOptions = {
        responsive: true,
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
    };
    const performanceData = [
        {
            title: 'New Leads',
            value: '1248',
            icon: <FaUserFriends className="w-12 h-12 text-indigo-200" />,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            title: 'Booked Revenue',
            value: '$76,450',
            icon: <MdMoney className="w-12 h-12 text-green-200" />,
            color: 'from-green-500 to-teal-500'
        },
        {
            title: 'Deals',
            value: '325',
            icon: <DollarSign className="w-12 h-12 text-yellow-200" />,
            color: 'from-yellow-500 to-orange-500'
        },
        {
            title: 'Total Orders',
            value: '22,487',
            icon: <ShoppingBasketIcon className="w-12 h-12 text-purple-200" />,
            color: 'from-purple-500 to-pink-500'
        }
    ];

    const initialOrders = [
        {
            id: 101,
            customer: "Ahmed Mohamed",
            total: 150.75,
            status: "Completed",
            date: "2025-01-15",
        },
        {
            id: 102,
            customer: "Sara Ali",
            total: 89.99,
            status: "Pending",
            date: "2025-01-20",
        },
        {
            id: 103,
            customer: "John Doe",
            total: 230.5,
            status: "Canceled",
            date: "2025-01-18",
        },
        {
            id: 104,
            customer: "Fatma Hassan",
            total: 320.9,
            status: "Completed",
            date: "2025-01-22",
        },
        {
            id: 105,
            customer: "Ali Omar",
            total: 120.0,
            status: "Pending",
            date: "2025-01-23",
        },
    ];
    
    const earningSectionRef = useRef(null);
    const barChartRef = useRef(null);
    const lowStockRef = useRef(null);
    const sectionRef = useRef(null);

    const isEarningVisible = useInView(earningSectionRef, { threshold: 0.2 });
    const isBarChartVisible = useInView(barChartRef, { threshold: 0.28 });
    const isLowStockVisible = useInView(lowStockRef, { threshold: 0.2 });
    const isVisible = useInView(sectionRef, { threshold: 0.2 });
    

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto space-y-6">
                {/* Preformance Section */}
                <motion.div
                    ref={sectionRef}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    {performanceData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={`p-6 rounded-xl shadow-lg text-white bg-gradient-to-r ${item.color} flex items-center gap-4`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">{item.title}</span>
                                <span className="text-2xl font-bold">{item.value}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                {/* Recent Orders */}
                {/* Orders Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Orders Overview</h3>
                    {initialOrders.length > 0 ? (
                        <div className="overflow-x-auto">
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
                                    {initialOrders.map((order, index) => (
                                        <tr
                                            key={index}
                                            className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td className="px-4 py-2">{order.id}</td>
                                            <td className="px-4 py-2">{order.customer}</td>
                                            <td className="px-4 py-2 font-semibold text-green-600">${order.total}</td>
                                            <td className={`px-4 py-2 font-medium ${
                                                order.status === 'Completed'
                                                    ? 'text-green-500'
                                                    : order.status === 'Pending'
                                                    ? 'text-yellow-500'
                                                    : 'text-red-500'
                                            }`}>
                                                {order.status}
                                            </td>
                                            <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={isEarningVisible ? { opacity: 1, y: 0 } : {} }
                    transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-6 shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">Earnings</h2>
                                    <p className="text-4xl font-extrabold mt-2">{total}$</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-white text-indigo-500 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200"
                                >
                                    Download
                                </motion.button>
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
                                                <td className="px-4 py-2 text-green-600 font-semibold">${item.value}</td>
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={ isBarChartVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
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
                                <p className="text-sm text-gray-500">Available: {product.available}</p>
                                <p className="text-lg font-bold text-indigo-600">${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Section */}
                <motion.div
                ref={lowStockRef}
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ x: -50, opacity: 0 }}
                animate={isLowStockVisible ? { x: 0, opacity: 1 } :{}}
                transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h3 className="text-xl font-semibold mb-4">Low Stock Products</h3>
                    <ul className="space-y-4">
                        {lowStock.map((item, index) => (
                            <motion.li
                                key={index}
                                className="flex justify-between items-center bg-red-100 p-4 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="font-medium text-red-600">{item.name}</span>
                                <span className="text-sm">Available: {item.available}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Orders Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Orders Overview</h3>
                    <p className="text-3xl font-bold">Total Revenue: ${orders.reduce((acc, item) => acc + item.revenue, 0)}</p>
                        {/* Pie Chart for Orders Overview */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-4">Orders Overview by Store</h3>
                            <div className="h-72">
                                <Pie data={pieData} />
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardFinance;
