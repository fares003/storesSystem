import React, { useState } from 'react';
import OrderCard from './OrderCard';
import axios from 'axios';

const API = import.meta.env.VITE_API;

const BulkBarcodeDispatch = () => {
    const [barcode, setBarcode] = useState('');
    const [productData, setProductData] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setProductData(null);
        setSuccessMessage('');
    
        try {
        const token = localStorage.getItem("token");

            const response = await axios.post(`${API}OutboundOrders/get-bulk`, {
                barcode: barcode,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    
            setProductData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch product data');
        }
    };
    


    const handleDispatch = async () => {
        try {
            await axios.post(`${API}OutboundOrders/dispatch-bulk`, {
                barcode: barcode
            });
    
            setSuccessMessage('Bulk dispatched successfully!');
            setProductData(prev => ({
                ...prev,
                dispatchedAt: new Date().toISOString()
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Dispatch failed');
        }
    };
    return (
        <div className="max-w-8xl mx-auto p-6 bg-gray-900 h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Enter barcode"
                        className="flex-1 p-3 rounded-lg bg-gray-800 text-white 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg 
                                   text-white font-medium transition-colors"
                    >
                        Fetch Orders
                    </button>
                </div>
            </form>

            {error && (
                <div className="mb-4 p-4 bg-red-900/30 text-red-400 rounded-lg">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-4 bg-green-900/30 text-green-400 rounded-lg">
                    {successMessage}
                </div>
            )}

            {productData && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Bulk Order - {productData.barcode}
                            </h2>
                            <p className="text-gray-400 mt-1">
                                {productData.orders.length} orders in this bulk
                            </p>
                        </div>
                        {!productData.dispatchedAt && (
                            <button
                                onClick={handleDispatch}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 
                                           rounded-lg text-white font-medium transition-colors"
                            >
                                Dispatch Bulk
                            </button>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 overflow-y-auto">
                        {productData.orders.map((order, index) => (
                            <OrderCard
                                key={order.id}
                                item={order}
                                i={index}
                                actionsConfig={{}}
                                isAdmin={false}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkBarcodeDispatch;