import { usePerformanceContext } from '@/contexts/PerformanceContext';
import React from 'react';
import { useParams } from 'react-router-dom';
import Center from './Center';
import Loader from './Loader';

const PerformanceDetails = ({ performanceData }) => {
    const { index } = useParams();
    const preformancePopupData = parseInt(index, 10);

    console.log("performanceData:", performanceData);
    console.log("preformancePopupData:", preformancePopupData);
    console.log("popupValues:", performanceData[preformancePopupData]?.popupValues);

    if (!performanceData || !performanceData[preformancePopupData]?.popupValues) {
        return <Center><Loader/></Center>;
    }

    if (preformancePopupData < 0 || preformancePopupData >= performanceData.length) {
        return <div>Invalid data index.</div>;
    }

    const popupValues = performanceData[preformancePopupData].popupValues;
    if (!Array.isArray(popupValues)) {
        return <Center><Loader/></Center>;
    }

    return (
        <Center>
            {preformancePopupData < 2 && (
                
                <div className='max-h-[80vh] w-[90%] p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg overflow-y-auto'>
                    <h1 className='font-bold text-lg mb-2'>Customers</h1>
                    <table className="min-w-full table-auto text-sm text-left overflow-y-auto border border-gray-700">
                        <thead className="bg-gray-800 text-gray-200">
                            <tr>
                                {performanceData[preformancePopupData].tableHeader.map((ele, i) => (
                                    <th key={i} className="px-6 py-3 border-b border-gray-700 font-bold text-center uppercase tracking-wide">
                                        {ele}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {popupValues.map((ele, i) => (
                                <tr key={i} className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-all">
                                    {performanceData[preformancePopupData].tableHeader.map((header, index) => (
                                        <td key={index} className="px-6 py-3 text-center text-gray-300">
                                            {ele[header]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {(preformancePopupData == 2 || preformancePopupData == 5) && (
                <div className=" w-[90%] p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Orders</h2>
                    <table className="min-w-full table-auto text-sm text-left border border-gray-700 overflow-y-auto">
                        <thead className="bg-gray-800 text-gray-200">
                            <tr>
                                {performanceData[preformancePopupData].tableHeader.map((header, i) => (
                                    <th key={i} className="px-6 py-3 border-b border-gray-700 font-bold text-center uppercase">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {popupValues.map((order, i) => (
                                <tr key={i} className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-all">
                                    <td className="px-6 py-3 text-center">{order.customer?.name || "N/A"}</td>
                                    <td className="px-6 py-3 text-center">{order.customer?.email || "N/A"}</td>
                                    <td className="px-6 py-3 text-center">{order.customer?.phoneNumber || "N/A"}</td>
                                    <td className="px-6 py-3 text-center">{order.status || "N/A"}</td>
                                    <td className="px-6 py-3 text-center">{order.total || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {preformancePopupData == 3 && (
                <div className="w-[90%] p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Products</h2>
                    <table className="min-w-full table-auto text-sm text-left border border-gray-700 overflow-y-auto">
                        <thead className="bg-gray-800 text-gray-200">
                            <tr>
                                {performanceData[preformancePopupData].tableHeader.map((header, i) => (
                                    <th key={i} className="px-6 py-3 border-b border-gray-700 font-bold text-center uppercase">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {popupValues.map((p, i) => (
                                <tr key={i} className="border-b border-gray-700 odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-all">
                                    <td className="px-6 py-3 text-center">{p.sku || "N/A"}</td>
                                    <td className="px-6 py-3 text-center">{p.product || "N/A"}</td>
                                    <td className="px-6 py-3 text-center">{p.sold || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Center>
    );
};

export default PerformanceDetails;