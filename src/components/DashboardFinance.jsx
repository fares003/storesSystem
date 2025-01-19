import { BoxesIcon, DollarSign } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import { GoDotFill } from "react-icons/go";
import { MdMoney } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';

const API = import.meta.env.VITE_API;
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

    const GetData = async () => {
        try {
            const target = `${API}Data/finances`;
            const resp = await fetch(target);
            const data = await resp.json();
            setEarningData(data);
        } catch (error) {
            console.error("Error fetching earnings data:", error);
        }
    };

    useEffect(() => {
        GetData();
    }, []);

    useEffect(() => {
        const tempTotal = earningData.reduce((acc, item) => acc + item.value, 0);
        setTotal(tempTotal);
    }, [earningData]);

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

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto space-y-6">
                {/* Earnings Section */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-6 shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Earnings</h2>
                                <p className="text-4xl font-extrabold mt-2">{total}$</p>
                            </div>
                            <button className="bg-white text-indigo-500 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200">
                                Download
                            </button>
                        </div>
                    </div>

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


                {/* Revenue Updates */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Revenue Updates</h3>
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center text-gray-500">
                                <GoDotFill className="text-gray-500" /> Expense
                            </span>
                            <span className="flex items-center text-green-500">
                                <GoDotFill className="text-green-500" /> Budget
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row mt-6 space-y-6 md:space-y-0 md:space-x-6">
                        <div className="md:w-1/3">
                            <h4 className="text-3xl font-bold">$220.654</h4>
                            <p className="text-sm text-gray-500 mt-2">Budget</p>
                        </div>
                        <div className="md:w-2/3">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Top Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-xl shadow-lg p-4">
                            <img
                                src="https://cdn-1.hosting.anfa.media/upload/q_50/https://waheteter.com/wp-content/uploads/2022/06/Dior-Sauvage.jpg"
                                alt="Sauvage Dior"
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h4 className="text-lg font-semibold mt-4">Sauvage Dior</h4>
                            <p className="text-xl font-bold text-indigo-600">$300</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardFinance;
