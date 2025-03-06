import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API;

const ShippingBulks = () => {
  const [bulks, setBulks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBulks = async () => {
      try {
        const response = await fetch(`${API}Shipping/bulks`);
        if (!response.ok) throw new Error('Failed to fetch bulks');
        const data = await response.json();
        setBulks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBulks();
  }, []);

  const getColorFromBarcode = (barcode) => {
    const colors = [
      'bg-purple-200', 'bg-blue-200', 'bg-green-200', 
      'bg-yellow-200', 'bg-pink-200', 'bg-indigo-200'
    ];
    return colors[barcode.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 p-6 bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-indigo-600" 
                 viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            Shipping Bulks
            <span className="ml-4 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-lg">
              {bulks.length} Entries
            </span>
          </h1>
        </div>

        {loading ? (
          <div className="text-center p-8 space-y-4">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-500 
                          rounded-full border-t-transparent"></div>
            <p className="text-indigo-700 text-lg font-medium">Loading Bulks...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-100 rounded-xl border border-red-200">
            <div className="flex items-center text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold">Error: {error}</h2>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bulks.map((bulk) => (
              <div key={bulk.barcode} 
                   className={`group relative p-6 rounded-2xl transition-all duration-300 
                             ${getColorFromBarcode(bulk.barcode)} hover:transform hover:scale-105 
                             hover:shadow-xl cursor-pointer`}>
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                         className="h-8 w-8 mr-3 text-indigo-600" viewBox="0 0 20 20" 
                         fill="currentColor">
                      <path fillRule="evenodd" 
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" 
                            clipRule="evenodd" />
                    </svg>
                    <span className="font-mono text-sm bg-black/10 px-2 py-1 rounded">
                      {bulk.barcode}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" 
                           viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" 
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
                              clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(bulk.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" 
                           viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" 
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                              clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(bulk.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/50 px-3 py-1 rounded-full 
                                text-sm font-medium text-indigo-600">
                    #{bulks.indexOf(bulk) + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingBulks;