import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";

function AllItems() {
  const API = import.meta.env.VITE_API ;
  
  const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const target = API + 'item';
        try {
            const response = await fetch(target);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else {
                console.error("Failed to fetch items.");
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const deleteItem = async (sku) => {
        const target = API + 'item/delete/' + sku;
        const request = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };

        try {
            const response = await fetch(target, request);
            if (response.ok) {
                const newItems = items.filter(item => item.sku !== sku) ;
                setItems(newItems);
                
                toast.success("deleted", {
                    position: "top-right",
                    autoClose: 3000,
                    });
            } else {
                toast.error("error", {
                    position: "top-right",
                    autoClose: 3000,
                    });
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <Center>
            <div className="flex flex-col items-center gap-4 w-full md:w-[90%]">
                <h2 className="textGradient text-3xl text-white font-semibold">Items List</h2>
    
                <div className="w-full text-white text-lg shadow-lg shadow-slate-500 rounded-b-lg">
                    <table className="min-w-full table-auto text-white rounded-lg overflow-hidden ">
                        <thead>
                            <tr className="bg-gray-900 text-center">
                                <th className="px-4 py-2 border-r border-gray-600 font-bold">Name</th>
                                <th className="px-4 py-2 border-r border-gray-600 font-bold">Price</th>
                                <th className="px-4 py-2 border-r border-gray-600 font-bold">Description</th>
                                <th className="px-4 py-2 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => {
                                return (
                                    <tr
                                        key={item.sku}
                                        className={`text-center ${i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600 transition-colors duration-200 ${i === 0 ? 'rounded-t-lg' : ''} ${i === items.length - 1 ? 'rounded-b-lg' : ''}`}
                                    >
                                        <td className="px-4 py-2 border-r border-gray-600">{item.name}</td>
                                        <td className="px-4 py-2 border-r border-gray-600">${item.price}</td>
                                        <td className="px-4 py-2 border-r border-gray-600">{item.description}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                className="text-red-500 hover:text-red-400 font-semibold"
                                                onClick={() => deleteItem(item.sku)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Center>
    );
    
    
}

export default AllItems;
