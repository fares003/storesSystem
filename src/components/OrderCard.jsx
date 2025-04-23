import { FiCheckCircle, FiEdit, FiInfo, FiPhone } from 'react-icons/fi'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAreYouSure } from '@/contexts/AreYouSure';
import { Tooltip } from "react-tooltip";


const OrderCard = ({
    item ,
    i ,
    actionsConfig ,
    isAdmin = false,
    isSelected ,  
    onToggleSelect ,
    cardClickable = false ,  
    handleUpdateOrder ,
    confirmOrder,       
    holdOrder,          
    cancelOrder,        
    handlePendingDelivery,
    shippingServices ,
    selectedService, 
    setSelectedService,
    isSelectAll,
    invoiceOrder

}) => {

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    
    const {setAreYouSurePopup} = useAreYouSure() ; 
    const [isChecked, setIsChecked] = useState(false);


    const navigate = useNavigate();
    const ActionComponent = actionsConfig?.[item.status];

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': 
                return 'bg-blue-500/20 text-blue-500';
            case 'Confirmed': 
                return 'bg-purple-500/20 text-purple-500';
            case 'Cancelled': 
                return 'bg-red-500/20 text-red-500';
            case 'In preparation': 
                return 'bg-amber-500/20 text-amber-500';
            case 'Ready for Shipping':
            case 'ready for shipment': 
                return 'bg-yellow-500/20 text-yellow-500';
            case 'In Transit': 
                return 'bg-indigo-500/20 text-indigo-500';
            case 'Delivered': 
                return 'bg-green-500/20 text-green-500';
            case 'Returned': 
                return 'bg-rose-500/20 text-rose-500';
            case 'Partially Delivered': 
                return 'bg-teal-500/20 text-teal-500';
            case 'Complete': 
                return 'bg-emerald-500/20 text-emerald-500';
            case 'pending delivery': 
                return 'bg-sky-500/20 text-sky-500';
            case 'pending preparation': 
                return 'bg-orange-500/20 text-orange-500';
            case 'hold': 
                return 'bg-gray-500/20 text-gray-500';
            default: 
                return 'bg-gray-500/20 text-gray-500';
        }
    };


    return (
    <motion.div
        key={item.id}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className={`relative bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ${isSelected ? 'border-2 border-purple-500' : 'border-0'} `}
    >
     {isSelectAll && (
        <div className="flex items-center mb-2">
          <input
            id={`checkbox-${item.id}`}
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="hidden peer"
          />
          <label
            htmlFor={`checkbox-${item.id}`}
            className="flex items-center cursor-pointer"
          >
            <div className={`
              w-5 h-5 rounded-sm border-2
              ${isSelected ? 'bg-purple-500 border-purple-700' : 'bg-white border-gray-300'}
              flex items-center justify-center
              transition-colors duration-200
            `}>
              {isSelected && (
                <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M16.6666 5L7.49992 14.1667L3.33325 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              )}
            </div>
            <span className="ml-2 text-white font-500">Select</span>
          </label>
        </div>
      )}

        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-semibold text-white">Order #{item.id}</h3>
                <p className="text-sm text-gray-400">{item.customer.name}</p>
                <span className="text-sm text-gray-400">{item.customer.province} - {item.customer.city}</span>
            </div>
            
            <span className="bg-green-300 text-green-900 px-3 py-1 rounded-full text-sm max-w-26 text-nowrap overflow-hidden text-ellipsis">
                {item.store}
            </span>


            <span className={`${getStatusColor(item.status)} px-3 py-1 rounded-full text-sm`}>
                {item.status}
            </span>
        </div>

        <div 
            className="space-y-3 mb-6 cursor-pointer"
            onClick={()=>{
                cardClickable && navigate("/OrderPreview", { state: { orderId: item.id } })
            }}>
            
            <div className="flex items-center text-sm">
                <FiPhone className="mr-2 text-gray-400" />
                <span className="text-gray-300">{item.customer.phoneNumber}</span>
            </div>

            <div className="flex items-center text-sm">
                <FiInfo className="mr-2 text-gray-400" />
                <span className="text-gray-300" data-tooltip-id={`tooltip-${item.id}`}>
                    {item.cart.length} items
                </span>
                <Tooltip id={`tooltip-${item.id}`} place="top-start" effect="solid" style={{backgroundColor:"grey" , color:"white"}}>
                    {item.cart.map(prod => <div key={prod.id}>{prod.name} x {prod.quantity}</div>)}
                </Tooltip>
            </div>

        <div className="flex items-center text-sm">
            <FiCheckCircle className="mr-2 text-gray-400" />
            <span className="text-emerald-400 font-semibold">EGP {item.total}</span>
        </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between gap-2">
                <button
                onClick={() => navigate("/OrderPreview", { state: { orderId: item.id } })}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-all"
                >
                <FiInfo className="text-base" />
                Details
                </button>
                
                {ActionComponent && (
                    <ActionComponent
                        item={item}
                        selectedAction={selectedAction}
                        setSelectedAction={setSelectedAction}
                        openDropdownId={openDropdownId}
                        setOpenDropdownId={setOpenDropdownId}
                        selectedService={selectedService}
                        setSelectedService={setSelectedService}
                        setAreYouSurePopup={setAreYouSurePopup}
                        confirmOrder={confirmOrder}
                        holdOrder={holdOrder}
                        cancelOrder={cancelOrder}
                        handlePendingDelivery={handlePendingDelivery}
                        shippingServices={shippingServices}
                        invoiceOrder={invoiceOrder}
                    />
            )}

                { (isAdmin && item.status=='New') && (
                    <div className="flex gap-2">
                        <button
                        onClick={() => handleUpdateOrder(item)}
                        className="p-2 hover:bg-gray-700 rounded-lg text-gray-300 transition-all"
                        >
                        <FiEdit className="text-lg" /> 
                        </button>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
  )
}

export default OrderCard
