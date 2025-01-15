import { useState, useEffect } from "react";

function Orders() {
  const API = import.meta.env.VITE_API ;
  const [orders, setOrders] = useState([]);

    const deleteOrder = (id) => {
        const target = API + 'orders/delete/' + id;
        const request = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        };

        fetch(target, request)
            .then(() => {
                setOrders((prevOrders) => prevOrders.filter(o => o.id !== id));
            })
            .catch(error => console.error("Error deleting order:", error));
    };

    const fetchOrders = async () => {
        const target = API + 'orders';
        const resp = await fetch(target);
        const data = await resp.json();
        setOrders(data);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className='orderList'>

            {orders.map((order , i) => (
                <p key={i}>this is p</p>
            ))}
        </div>
    );
}

export default Orders;


