import React, { useState, useEffect } from 'react'
import axios from 'axios'
import OrderCard from './OrderCard'
import { FiChevronDown } from 'react-icons/fi'

const API = import.meta.env.VITE_API;

const AllOrdersReady = () => {
    const [selectedService, setSelectedService] = useState('')
    const [services, setServices] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [servicesLoading, setServicesLoading] = useState(true)
    const [selectedOrders, setSelectedOrders] = useState([])
    const [bulkLoading, setBulkLoading] = useState(false)
    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API}shipping/services`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setServices(response.data)
            } catch (err) {
                setError('Failed to load shipping services')
            } finally {
                setServicesLoading(false)
            }
        }
        fetchServices()
    }, [])

    const fetchOrders = async () => {
        if (!selectedService) return
        setLoading(true)
        setError('')
        try {
            const response = await axios.get(`${API}shipping/ready/${selectedService}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrders(response.data)
        } catch (err) {
            setError('Failed to load orders')
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
        setSelectedOrders([]) // Reset selections when service changes
    }, [selectedService])

    const handleSelectOrder = (orderId) => {
        setSelectedOrders(prev => 
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        )
    }

    const handleCreateBulk = async () => {
        if (!selectedOrders.length) return
        
        setBulkLoading(true)
        try {
            await axios.post(`${API}outboundOrders/create-bulk`, 
                { orderIds: selectedOrders },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            // Refresh orders and clear selection
            await fetchOrders()
            setSelectedOrders([])
        } catch (err) {
            setError('Failed to create bulk order')
        } finally {
            setBulkLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen">
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 w-full sm:w-auto">
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        disabled={servicesLoading}
                        className="w-full px-4 py-3 pr-10 bg-gray-800 text-white rounded-lg 
                                   appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Select Shipping Service</option>
                        {services.map((service) => (
                            <option key={service} value={service} className="bg-gray-800">
                                {service}
                            </option>
                        ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                
                {servicesLoading && (
                    <div className="text-sm text-gray-400">Loading services...</div>
                )}
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-900/30 text-red-400 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading orders...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            item={order}
                            isSelected={selectedOrders.includes(order.id)}
                            onToggleSelect={() => handleSelectOrder(order.id)}
                            actionsConfig={{}}
                            isAdmin={false}
                            handleUpdateOrder={() => {}}
                            confirmOrder={() => {}}
                            holdOrder={() => {}}
                            cancelOrder={() => {}}
                            handlePendingDelivery={() => {}}
                            handledeliver={() => {}}
                        />
                    ))}
                </div>
            )}

            {!loading && orders.length === 0 && selectedService && (
                <div className="text-center text-gray-400 py-8">
                    No orders found for {selectedService}
                </div>
            )}

            {selectedOrders.length > 0 && (
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={handleCreateBulk}
                        disabled={bulkLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg 
                                   shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {bulkLoading ? 'Processing...' : `Create Bulk (${selectedOrders.length})`}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllOrdersReady