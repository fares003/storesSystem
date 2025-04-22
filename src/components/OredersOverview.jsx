import React, { useEffect, useState, useRef } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { motion } from "framer-motion";
import { FaBox, FaShippingFast, FaMoneyBillWave, FaTimesCircle, FaCheckCircle, FaClock, FaStore } from 'react-icons/fa';
import useInView from "@/Hooks/useInView";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from 'axios';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const OrdersDashboard = () => {
    const [timeInterval, setTimeInterval] = useState('month');
    const [orders, setOrders] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const API = import.meta.env.VITE_API;

    // Fetch orders data
    useEffect(() => {
        const fetchOrders = async () => {
            try {
      const token = localStorage.getItem("token");

                const response = await axios.get(`${API}Orders`,{
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
            });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [timeInterval]);

    // Calculate order statistics
    const calculateStats = () => {
        const statusCounts = {
            'New': 0,
            'pending preparation': 0,
            'ready for shipment': 0,
            'In Transit': 0,
            'Delivered': 0,
            'Cancelled': 0,
            'hold': 0,
            'pending delivery': 0
        };

        let totalRevenue = 0;
        let totalItems = 0;
        const storeRevenue = {};
        const cityDistribution = {};
        const provinceDistribution = {};
        const statusRevenue = {};
        const hourlyDistribution = Array(24).fill(0);

        orders.forEach(order => {
            // Count by status
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
            
            // Calculate revenue
            totalRevenue += order.total;
            
            // Count items
            totalItems += order.cart.reduce((sum, item) => sum + item.quantity, 0);
            
            // Store revenue
            storeRevenue[order.store] = (storeRevenue[order.store] || 0) + order.total;
            
            // City distribution
            cityDistribution[order.customer.city] = (cityDistribution[order.customer.city] || 0) + 1;
            
            // Province distribution
            provinceDistribution[order.customer.province] = (provinceDistribution[order.customer.province] || 0) + 1;
            
            // Status revenue
            statusRevenue[order.status] = (statusRevenue[order.status] || 0) + order.total;
            
            // Hourly distribution
            const orderTime = new Date(order.orderTime);
            const hour = orderTime.getHours();
            hourlyDistribution[hour]++;
        });

        return {
            statusCounts,
            totalRevenue,
            totalItems,
            storeRevenue,
            cityDistribution,
            provinceDistribution,
            statusRevenue,
            hourlyDistribution,
            averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
        };
    };

    const stats = calculateStats();

    // Prepare chart data
    const statusChartData = {
        labels: Object.keys(stats.statusCounts),
        datasets: [{
            label: 'Orders by Status',
            data: Object.values(stats.statusCounts),
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)', // New - blue
                'rgba(255, 206, 86, 0.7)',   // pending preparation - yellow
                'rgba(75, 192, 192, 0.7)',   // ready for shipment - teal
                'rgba(153, 102, 255, 0.7)', // In Transit - purple
                'rgba(50, 205, 50, 0.7)',    // Delivered - green
                'rgba(255, 99, 132, 0.7)',  // Cancelled - red
                'rgba(255, 159, 64, 0.7)',  // hold - orange
                'rgba(169, 169, 169, 0.7)'   // pending delivery - gray
            ],
            borderWidth: 1
        }]
    };

    const revenueByStatusData = {
        labels: Object.keys(stats.statusRevenue),
        datasets: [{
            label: 'Revenue by Status (EGP)',
            data: Object.values(stats.statusRevenue),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const hourlyDistributionData = {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [{
            label: 'Orders by Hour',
            data: stats.hourlyDistribution,
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    };

    const storeRevenueData = {
        labels: Object.keys(stats.storeRevenue),
        datasets: [{
            label: 'Revenue by Store (EGP)',
            data: Object.values(stats.storeRevenue),
            backgroundColor: 'rgba(255, 159, 64, 0.7)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }]
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '',
                font: {
                    size: 16
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Performance metrics
    const performanceData = [
        {
            title: 'Total Orders',
            value: orders.length,
            icon: <FaBox className="w-8 h-8" />,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            title: 'Total Revenue',
            value: `${stats.totalRevenue} EGP`,
            icon: <FaMoneyBillWave className="w-8 h-8" />,
            color: 'from-green-500 to-teal-500'
        },
        {
            title: 'Avg. Order Value',
            value: `${stats.averageOrderValue.toFixed(2)} EGP`,
            icon: <FaMoneyBillWave className="w-8 h-8" />,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Total Items Sold',
            value: stats.totalItems,
            icon: <FaBox className="w-8 h-8" />,
            color: 'from-yellow-500 to-orange-500'
        },
        {
            title: 'In Transit',
            value: stats.statusCounts['In Transit'] || 0,
            icon: <FaShippingFast className="w-8 h-8" />,
            color: 'from-indigo-500 to-purple-500'
        },
        {
            title: 'Pending Preparation',
            value: stats.statusCounts['pending preparation'] || 0,
            icon: <FaClock className="w-8 h-8" />,
            color: 'from-yellow-500 to-amber-500'
        },
        {
            title: 'Cancelled',
            value: stats.statusCounts['Cancelled'] || 0,
            icon: <FaTimesCircle className="w-8 h-8" />,
            color: 'from-red-500 to-pink-500'
        },
        {
            title: 'Delivered',
            value: stats.statusCounts['Delivered'] || 0,
            icon: <FaCheckCircle className="w-8 h-8" />,
            color: 'from-green-500 to-emerald-500'
        }
    ];

    // Recent orders (last 5)
    const recentOrders = [...orders].sort((a, b) => 
        new Date(b.orderTime) - new Date(a.orderTime)
    ).slice(0, 5);

    // Download as PDF
    const downloadData = async () => {
        setIsCapturing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const dashboard = document.getElementById("orders-dashboard");
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

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("orders_report.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsCapturing(false);
        }
    };

    // Animation refs
    const sectionRef = useRef(null);
    const chartsRef = useRef(null);
    const isVisible = useInView(sectionRef, { threshold: 0.1 });
    const isChartsVisible = useInView(chartsRef, { threshold: 0.1 });

    return (
        <div id="orders-dashboard" className={`min-h-screen bg-gray-100 p-6 ${isCapturing && 'animate-pulse'}`}>
            <div className="container mx-auto space-y-6">
                {/* Header and Time Filter */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Orders Dashboard</h1>
                    <div className="flex space-x-2">
                        {['day', 'week', 'month', 'year'].map((interval) => (
                            <button
                                key={interval}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    timeInterval === interval
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setTimeInterval(interval)}
                            >
                                {interval.charAt(0).toUpperCase() + interval.slice(1)}
                            </button>
                        ))}
                        <button 
                            onClick={downloadData}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 ml-2"
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Performance Metrics */}
                <motion.div
                    ref={sectionRef}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                    initial={isCapturing ? false : { opacity: 0, y: 20 }}
                    animate={isCapturing ? { opacity: 1, y: 0 } : isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    {performanceData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={`p-4 rounded-lg shadow-md text-white bg-gradient-to-r ${item.color}`}
                            initial={isCapturing ? false : { opacity: 0, y: 20 }}
                            animate={isCapturing ? { opacity: 1, y: 0 } : isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="text-2xl font-bold">{item.value}</p>
                                </div>
                                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                                    {item.icon}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Section */}
                <motion.div
                    ref={chartsRef}
                    className="space-y-6"
                    initial={isCapturing ? false : { opacity: 0 }}
                    animate={isCapturing ? { opacity: 1 } : isChartsVisible ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Orders by Status (Pie) */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
                            <div className="h-64">
                                <Pie 
                                    data={statusChartData} 
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                ...chartOptions.plugins.title,
                                                text: 'Distribution of Orders by Status'
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>

                        {/* Revenue by Status (Bar) */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Revenue by Status</h3>
                            <div className="h-64">
                                <Bar 
                                    data={revenueByStatusData} 
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                ...chartOptions.plugins.title,
                                                text: 'Revenue Generated by Order Status'
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>

                        {/* Hourly Distribution */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Order Time Distribution</h3>
                            <div className="h-64">
                                <Bar 
                                    data={hourlyDistributionData} 
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                ...chartOptions.plugins.title,
                                                text: 'Orders Placed by Hour of Day'
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>

                        {/* Store Revenue */}
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Revenue by Store</h3>
                            <div className="h-64">
                                <Bar 
                                    data={storeRevenueData} 
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                ...chartOptions.plugins.title,
                                                text: 'Revenue Generated by Store'
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            <div>
                                                <div className="font-medium">{order.customer.name}</div>
                                                <div className="text-gray-500">{order.customer.city}, {order.customer.province}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {order.cart.reduce((sum, item) => sum + item.quantity, 0)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {order.total} EGP
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(order.orderTime).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-md font-medium mb-2">By Province</h4>
                            <ul className="space-y-2">
                                {Object.entries(stats.provinceDistribution)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([province, count]) => (
                                        <li key={province} className="flex justify-between items-center">
                                            <span className="text-gray-700">{province}</span>
                                            <span className="font-semibold">{count} orders</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-md font-medium mb-2">By City</h4>
                            <ul className="space-y-2">
                                {Object.entries(stats.cityDistribution)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5)
                                    .map(([city, count]) => (
                                        <li key={city} className="flex justify-between items-center">
                                            <span className="text-gray-700">{city}</span>
                                            <span className="font-semibold">{count} orders</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersDashboard;