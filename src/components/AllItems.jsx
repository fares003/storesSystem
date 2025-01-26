import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Center from "@/components/Center";
import axios from "axios";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API;

function AllItems() {
    const [items, setItems] = useState([]);
    const [paginationItems, setPaginationItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // عدد العناصر لكل صفحة

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const target = `${API}item`;
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(target, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setItems(response.data);
                paginate(1, response.data);
            } else {
                console.error("Failed to fetch items.");
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const deleteItem = async (sku) => {
        const target = `${API}item/delete/${sku}`;
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(target, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const newItems = items.filter((item) => item.sku !== sku);
                setItems(newItems);
                paginate(currentPage, newItems);
                toast.success("Deleted successfully", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                toast.error("Failed to delete item", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Error deleting item", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const paginate = (pageNumber, data = items) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const tempItems = data.slice(startIndex, endIndex);
        setPaginationItems(tempItems);
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <Center className={"px-5"}>
            <div className="w-full overflow-x-auto text-white text-lg shadow-md rounded-lg bg-gray-900">
                <table className="min-w-full table-auto text-sm text-left">
                    <thead className="bg-gray-800 text-gray-200">
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">SKU</th>
                            <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Name</th>
                            <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Price</th>
                            <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Description</th>
                            <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Available</th>
                            <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Reserved</th>
                            <th className="px-6 py-3 border-b border-gray-700 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginationItems.map((item, i) => (
                            <motion.tr
                                key={item.sku}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.2 }}
                                className={`text-center ${
                                    i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                } hover:bg-gray-600 transition-colors duration-200`}
                            >
                                <td className="px-6 py-3 border-b border-gray-700">{item.sku}</td>
                                <td className="px-6 py-3 border-b border-gray-700">{item.name}</td>
                                <td className="px-6 py-3 border-b border-gray-700">${item.price}</td>
                                <td className="px-6 py-3 border-b border-gray-700 truncate max-w-[200px]">
                                    {item.description}
                                </td>
                                <td className="px-6 py-3 border-b border-gray-700">{item.available}</td>
                                <td className="px-6 py-3 border-b border-gray-700">{item.reserved}</td>
                                <td className="px-6 py-3 border-b border-gray-700">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                                        onClick={() => deleteItem(item.sku)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                        currentPage === 1
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-700"
                    } text-white`}
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                            currentPage === index + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 hover:bg-gray-700 text-white"
                        }`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                        currentPage === totalPages
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-700"
                    } text-white`}
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </Center>
    );
}

export default AllItems;
