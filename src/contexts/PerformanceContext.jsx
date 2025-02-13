import { DollarSign, ShoppingBasketIcon } from "lucide-react";
import {createContext , useContext , useEffect, useState } from "react" ; 
import { FaUserFriends } from "react-icons/fa";
import { MdMoney } from "react-icons/md";

const API = import.meta.env.VITE_API;

const PerformanceContext = createContext() ;


export const PerformanceProvider = ({children}) => {
    
    const [timeInterval, setTimeInterval] = useState('year');

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
    const [performanceData , setPerformanceData] = useState() ;

    useEffect(()=>{
        fetchData(`reports/new-customers?groupBy=${timeInterval}`, setNewCustomers);
        fetchData(`reports/customers?groupBy=${timeInterval}`,setCustomers);
        fetchData(`reports/orders?groupBy=${timeInterval}`, setOrdersCard);
        fetchData(`reports/total-sales?groupBy=${timeInterval}`, setSales);
        fetchData(`reports/products?groupBy=${timeInterval}`, setProduct);
        fetchData(`reports/shipping-items`, setShipping);
        fetchData(`reports/delivered-orders?groupBy=${timeInterval}`, setDeliveredOrders);
        fetchData(`reports/new-orders?groupBy=${timeInterval}`, setnewOrders);
        fetchData(`reports/recent-customers?groupBy=${timeInterval}`, setrecentCustomers);
        fetchData(`reports/all-new-customers?groupBy=${timeInterval}`, setallNewCustomers);
        fetchData(`reports/all-delivered-orders?groupBy=${timeInterval}`, setDeliverdOrders);
        fetchData(`reports/product-sales?groupBy=${timeInterval}`, setProductSales);
        // fetchData(`reports/net-profit?groupBy=${timeInterval}`, setNetProfit);
        setPerformanceData(
            [
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
            ]
        )
    } , [timeInterval])
    return (
        <PerformanceContext.Provider value={{performanceData , timeInterval, setTimeInterval}}>
            {children}
        </PerformanceContext.Provider>
    )
};

export const usePerformanceContext = ()=> useContext(PerformanceContext) ; 