import React, { useState } from 'react'

function WareHouseComponent() {

    const [orderQuantity, setOrderQuantity] = useState(5);

return (
    <div className="w-full h-screen flex items-start justify-center mt-8 text-white">
      <div className="w-full max-w-4xl overflow-y-auto scrollbar-thin mx-10">
        {/* Title */}
        <div className="flex flex-col items-center text-white mb-8">
          <h1 className="text-5xl font-extrabold dark:text-white">
            Warehouse Management
          </h1>
        </div>

        {/* Search Bar with Bottom Border */}
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center space-x-4 w-fit pb-2 border-b border-white">
            <input
              type="text"
              placeholder="Enter order barcode here..."
              className="px-4 py-2 w-80 bg-gray-700 text-white rounded-md outline-none placeholder-gray-400"
            />
            <button className="px-6 py-2 bg-white text-black font-semibold rounded-md shadow-md hover:bg-gray-200">
              Search
            </button>
          </div>
        </div>

        {/* Section to Hold Inputs */}
        <div className="mt-6 flex flex-col items-center  rounded-lg shadow-lg">
          <div className="w-full flex flex-col items-center space-y-3">
            {Array.from({ length: orderQuantity }, (_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Barcode ${index + 1}`}
                className=" px-4 py-2 w-80 bg-white text-black  outline-none placeholder-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    </div>


)
}

export default WareHouseComponent