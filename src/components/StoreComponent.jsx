import React, { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
const API = import.meta.env.VITE_API;

function StoreComponent() {
    const [stores, setStores] = useState([])
    const [newStore, setNewStore] = useState({
        name: "",
        inventoryId: ""
    })
    const [showAddStoreModal, setShowAddStoreModal] = useState(false)
    const [inventories, setInventories] = useState([])

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const target = API + `store`;
                const response = await axios.get(target, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = response.data
                setStores(data)
            } catch (error) {
                console.error('Error fetching stores:', error)
            }
        }

        fetchStores()
    }, [])

    useEffect(() => {
        const fetchInventories = async () => {
            try {
                const target = API + `OutboundOrders/own-inventories`;
                const response = await axios.get(target, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = response.data
                setInventories(data)
            } catch (error) {
                console.error('Error fetching inventories:', error)
            }
        }

        fetchInventories()
    }, [])

    const handleActive = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You are about to activate this Store",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, activate!',
            cancelButtonText: 'Cancel'
        });
        if (result.isConfirmed) {
            try {
                const target = API + `Store/activate`;
                const response = await axios.post(target, { id: id }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.status === 200) {
                    const updatedStores = stores.map(store =>
                        store.id === id ? { ...store, active: true } : store
                    );
                    setStores(updatedStores);
                    Swal.fire(
                        'Activated!',
                        'The store has been activated.',
                        'success'
                    )
                }
                else {
                    Swal.fire(
                        'Error!',
                        'Failed to activate the store .',
                        'error'
                    )
                }

            } catch (error) {
                Swal.fire(
                    'Error!',
                    'Failed to activate the store .',
                    'error'
                )            
            }
        }
    }

    const handleAddStore = () => {
        setShowAddStoreModal(true)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewStore(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const target = API + `Store`;
            const response = await axios.post(target, {
                name: newStore.name,
                inventoryId: parseInt(newStore.inventoryId)
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200 || response.status === 201) {
                setStores([...stores, response.data])
                setNewStore({
                    name: "",
                    inventoryId: ""
                })
                setShowAddStoreModal(false)
                Swal.fire(
                    'Success!',
                    'Store added successfully!',
                    'success'
                )
            }
        } catch (error) {
            console.error('Error adding store:', error)
            Swal.fire(
                'Error!',
                'Failed to add store.',
                'error'
            )
        }
    }

    return (
        <div className="text-white p-5 bg-[#1E293B] rounded-md m-5 shadow-lg">
            <h2 className="text-xl font-bold text-center text-[#FACC15] mb-4">
                Stores List
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-700 bg-[#0F172A] text-left border-collapse text-[#E2E8F0]">
                    <thead className="bg-[#334155] text-white">
                        <tr className="border-b-2 border-gray-700">
                            <th className="p-3 text-md font-bold text-center">ID</th>
                            <th className="p-3 text-md font-bold text-center">Name</th>
                            <th className="p-3 text-md font-bold text-center">Inventory</th>
                            <th className="p-3 text-md font-bold text-center">Inventory Id</th>
                            <th className="p-3 text-md font-bold text-center">Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.length > 0 ? (
                            stores.map((store) => (
                                <tr
                                    key={store.id}
                                    className="border border-gray-600 hover:bg-[#1E293B] transition duration-300"
                                >
                                    <td className="p-3 text-sm border border-gray-700 text-center">
                                        {store.id}
                                    </td>
                                    <td className="p-3 text-sm border border-gray-700 text-center">
                                        {store.name}
                                    </td>
                                    <td className="p-3 text-sm border border-gray-700 text-center">
                                        {store.inventory}
                                    </td>
                                    <td className="p-3 text-sm border border-gray-700 text-center">
                                        {store.inventoryId}
                                    </td>
                                    <td className="p-2 text-sm border border-gray-700 text-center">
                                        {store.isActive ? (
                                            <span className="px-3 py-1 text-green-600 bg-green-100 rounded-full font-semibold">
                                                Activated
                                            </span>
                                        ) : (
                                            <button
                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleActive(store.id)
                                                }}
                                            >
                                                Activate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-400">
                                    No stores found.
                                </td>
                            </tr>
                        )}
                        <tr onClick={handleAddStore} className="hover:bg-[#1E293B]">
                            <td colSpan="8" className="p-4 text-center text-gray-400 " style={{ cursor: 'pointer' }}>
                                + Add New Store
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Add Store Modal */}
            {showAddStoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1E293B] p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-[#FACC15] mb-4">Add New Store</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Store Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newStore.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Inventory
                                </label>
                                <select
                                    name="inventoryId"
                                    value={newStore.inventoryId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                                    required
                                >
                                    <option value="">Select Inventory</option>
                                    {inventories.map((inventory) => (
                                        <option key={inventory.id} value={inventory.id}>
                                            {inventory.manager || 'Unnamed Inventory'} (ID: {inventory.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddStoreModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add Store
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StoreComponent