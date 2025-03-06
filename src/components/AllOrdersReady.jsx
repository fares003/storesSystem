import React, { useState, useEffect } from 'react'
import axios from 'axios'
import OrderCard from './OrderCard'
import { FiChevronDown } from 'react-icons/fi'
import governorates from "@/Data/governorates.js"

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
    const [filterDate, setFilterDate] = useState('')
    const [filterGov, setFilterGov]=  useState(null)
    const token = localStorage.getItem("token")

    const governorateOptions = governorates[2].data;

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
        setSelectedOrders([])
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
            await fetchOrders()
            setSelectedOrders([])
        } catch (err) {
            setError('Failed to create bulk order')
        } finally {
            setBulkLoading(false)
        }
    }

    const filteredOrders = orders.filter(order => {
        // Parse order date
        const [datePart, timePart] = order.orderTime.split(' ')
        const [month, day, year] = datePart.split('/').map(Number)
        const [time, modifier] = timePart.split(' ')
        const [hours, minutes] = time.split(':').map(Number)
        
        let parsedHours = hours
        if (modifier === 'PM' && hours !== 12) parsedHours += 12
        if (modifier === 'AM' && hours === 12) parsedHours = 0
        
        const orderDate = new Date(year, month - 1, day, parsedHours, minutes)

        // Date filter check
        const dateFilter = filterDate ? new Date(filterDate) : null
        const meetsDate = !dateFilter || (
            orderDate.getFullYear() === dateFilter.getFullYear() &&
            orderDate.getMonth() === dateFilter.getMonth() &&
            orderDate.getDate() === dateFilter.getDate()
        )
        const orderGov = order.customer.province ;
        
        if(filterGov == null){
            return meetsDate
        }
        else{
            
            const meetsGov = filterGov===orderGov ;

            return meetsDate && meetsGov;
        }
        
    })
    const handleClearFilters = ()=>{
        setFilterDate("");
        setFilterGov(null);
    }
    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen">
            <div className="mb-8 space-y-4">
                {/* Service Selector */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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

                {/* New Filters */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg 
                                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <select
                        name="province"
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={filterGov}
                        onChange={(e) => setFilterGov(e.target.value)}
                        >
                        <option value="">Select Governorate</option>
                        {governorateOptions.map((gov) => (
                            <option key={gov.id} value={gov.governorate_name_en}>
                            {gov.governorate_name_en}
                            </option>
                        ))}
                        </select>
                    </div>
                    <button className='bg-green-500 text-white font-medium rounded-md px-4' onClick={()=>{handleClearFilters()}}>clear filters</button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-900/30 text-red-400 rounded-lg">
                    {error}
                </div>
            )}

            {/* Orders Grid */}
            {loading ? (
                <div className="text-center text-gray-400 py-8">Loading orders...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order) => (
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

            {/* No Orders Message */}
            {!loading && filteredOrders.length === 0 && selectedService && (
                <div className="text-center text-gray-400 py-8">
                    {orders.length === 0 
                        ? `No orders found for ${selectedService}`
                        : "No orders match the current filters"}
                </div>
            )}

            {/* Create Bulk Button */}
            {selectedOrders.length > 0 && (
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={handleCreateBulk}
                        disabled={bulkLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg 
                                shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center gap-2"
                    >
                        {bulkLoading && (
                            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        )}
                        {bulkLoading ? 'Processing...' : `Create Bulk (${selectedOrders.length})`}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllOrdersReady