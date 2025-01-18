import { useState, useEffect } from "react";
import Center from "./Center";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ArrowDown } from "lucide-react";

function AllOrders() {
  const API = import.meta.env.VITE_API ;
  const [orders, setOrders] = useState([]);
  console.log(orders);
  
    const deleteOrder = async (id) => {
        const target = API + 'orders/delete/' + id;
        const request = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        };

        await fetch(target, request)
            .then(() => {
                setOrders((prevOrders) => prevOrders.filter(o => o.id !== id));
            })
            .catch(error => console.error("Error deleting order:", error));
    };

    const status = async () => {
        const token = localStorage.getItem("token");
        const target = API + 'orders/status';
        const request = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        await fetch(target, request)
            .then(() => {
                console.log(target);
                
            })
            .catch(error => console.error("Error deleting order:", error));
    };
    
    useEffect(()=>{
        status() 
    },[])
    const fetchOrders = async () => {
        const target = API + 'orders';
        const resp = await fetch(target);
        const data = await resp.json();
        setOrders(data);
    };

    useEffect(() => {
        fetchOrders();
    }, []);
    const handleUpdateOrder = ()=>{
        
    }
    return (
    <Center>
        <div className="flex flex-col items-center gap-4 w-full md:w-[90%] overflow-y-auto scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300 z-10 ">
            <div className="bg-[#323949] w-full flex flex-col gap-4 sticky top-0 z-20">
                <h2 className="flex items-center justify-center textGradient text-3xl text-white font-semibold">Orders List</h2>
                <div className="flex text-white w-full items-center justify-between px-5 py-2 ">
                    <span>username</span>
                    <span>status</span>
                    <span>total</span>
                    <span></span>
                </div>
            </div>

            <div className="w-full text-white text-lg shadow-lg shadow-slate-500 rounded-b-lg z-10">
                {
                    orders.map((item , i)=>(
                            <Accordion key={i}>
                                <AccordionSummary
                                    expandIcon={<ArrowDown />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <span>{item.customer.username}</span>
                                        <span>{item.status}</span>
                                        <span>{item.total}</span>
                                        <span></span>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <h3> Cart Items : </h3>
                                    <div className="grid grid-cols-12 gap-4 my-4">
                                        {/* product */}
                                        {
                                            item.cart.map((product , j)=>(
                                                <div key={j} className="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-4 shadow-sm bg-gray-300 p-2 py-4 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span> prouduct name :</span>
                                                        <span>{product.name}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="flex items-center justify-between">
                                                        <span> Quantity :</span>
                                                        <span>{product.quantity}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="flex items-center justify-between">
                                                        <span> price :</span>
                                                        <span>{product.price}$</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    
                                    <div className="float-right flex gap-2 mb-2">
                                        <button className="bg-orange-600 text-white px-4 py-1 rounded-md" onClick={handleUpdateOrder}>update</button>
                                        <button className="bg-red-600 text-white px-4 py-1 rounded-md" onClick={()=>{deleteOrder(item.id)}}>delete</button>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ))
                }
            </div>
        </div>
    </Center>
    );
}

export default AllOrders;


