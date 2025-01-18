import { DollarSign } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import {GoDotFill} from "react-icons/go"
const API = import.meta.env.VITE_API ;
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const DashboardFinance = () => {
    const [earningData , setEarningData] = useState([]) ;
    const [total , setTotal] = useState(0) ; 
    const [barChartData , setbarChartData] = useState([]) ;
    

    const GetData = async ()=>{
        const target = API + "Data/finances";
        const resp = await fetch(target);
        const data = await resp.json();
        setEarningData(data);
    }

    useEffect(()=>{
        GetData()
    }, [])

    useEffect(() => {
        let tempTotal = 0;
        earningData.forEach((item) => {
            tempTotal += item.value;
        });
        setTotal(tempTotal);
    }, [earningData]);


    const getRevenue = async ()=>{
        const target = API + "Data/stores";
        const resp = await fetch(target);
        const data = await resp.json();
        setbarChartData(data);
    }

    useEffect(()=>{
        getRevenue() ; 
    })
    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Earnings',
            data: [12000, 15000, 8000, 18000, 22000, 25000, 20000],
            backgroundColor: 'rgba(80, 80, 80, 0.7)',
            borderColor: 'rgba(80, 80, 80, 1)',
            borderWidth: 1,
          },
        ],
      };
    
      const barOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      };

    return (
        <div className="mt-12">
            <div className="flex flex-wrap lg:flex-nowrap justify-center">
                {/* Earnings Section */}
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                        <p className="font-bold text-gray-400 dark:text-gray-200">Earnings</p>
                        <p className="text-2xl">{total}$</p>
                        </div>
                        {/* Download Button */}
                        <div className="mt-6 flex justify-center">
                            <button className="bg-slate-800 hover:bg-slate-700 duration-200 text-white px-3 py-2 rounded-md">
                            Download
                            </button>
                        </div>
                    </div>

                    {/* Earnings Data */}
                    <div className="flex flex-wrap gap-4">
                        {earningData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-slate-700 dark:text-gray-200 dark:bg-secondary-dark-bg p-4 rounded-lg flex flex-col items-center text-center flex-1 min-w-[120px]"
                        >
                            <button
                            type="button"
                            className="text-2xl opacity-90 rounded-full p-3 mb-3 hover:shadow-sm hover:shadow-white "
                            >
                                <DollarSign />
                            </button>
                            <p className="text-lg font-semibold">{item.value} $</p>
                            <p className="text-sm text-gray-400 mt-1">{item.name}</p>
                        </div>
                        ))}
                        
                    </div>

                    
                </div>
            </div>

            <div className="flex gap-10 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
                    <div className="flex justify-between">
                    <p className="font-semibold text-xl">Revenue Updates</p>
                    <div className="flex items-center gap-4">
                        <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                        <span>
                            <GoDotFill />
                        </span>
                        <span> Expense </span>
                        </p>

                        <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                        <span>
                            <GoDotFill />
                        </span>
                        <span> Budget </span>
                        </p>
                    </div>
                    </div>
                    <div className="mt-10 flex gap-10 flex-wrap justify-between items-center">
                    <div className="border-r-1 border-color m-4 pr-10">
                        <div>
                        <p>
                            <span className="text-3xl font-semibold">$220.654</span>
                            <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                            23%
                            </span>
                        </p>
                        <p className="text-gray-500 mt-1">Budget</p>
                        </div>

                        <div className="mt-8">
                        <p>
                            <span className="text-3xl font-semibold">$21,547</span>
                        </p>
                        <p>Expense</p>
                        </div>

                        <div className="mt-10">
                        <button className="bg-slate-800 hover:bg-slate-700 duration-200 text-white px-2 py-2 rounded-md">
                            Download Report
                        </button>
                        </div>
                    </div>

                    {/* بار شارت */}
                    <div className="flex-1 min-w-[300px] max-w-[500px]">
                        <Bar data={barData} options={barOptions} />
                    </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default DashboardFinance