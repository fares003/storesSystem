import { ArrowDown } from 'lucide-react'
import { useState } from 'react'


export const NewOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder
}) => {
  return (
    <div className="relative flex">
      <button
        onClick={() => {
          if (selectedAction === 'hold') {
            setAreYouSurePopup({ open: true, actions: () => holdOrder(item.id) })
          } else if (selectedAction === 'cancel') {
            setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) })
          } else {
            setAreYouSurePopup({ open: true, actions: () => confirmOrder(item.id) })
          }
        }}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'hold' 
            ? 'bg-yellow-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'hold' ? 'Hold' :
        selectedAction === 'cancel' ? 'Cancel' :
        'Confirm'}
      </button>

      <div className="relative">
        <button
          onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
          className="px-3 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-r-lg transition-all"
        >
          <ArrowDown size={20} />
        </button>

        {openDropdownId === item.id && (
          <div className="absolute top-full right-0 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {selectedAction !== 'confirm' && (
              <button
                onClick={() => {
                  setSelectedAction('confirm')
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Confirm
              </button>
            )}

            {selectedAction !== 'hold' && (
              <button
                onClick={() => {
                  setSelectedAction('hold')
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Hold
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => {
                  setSelectedAction('cancel')
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export const InTransitOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder
}) => {
  return (
    <div className="relative flex">
      <button
        onClick={() => {
          if (selectedAction === 'hold') {
            setAreYouSurePopup({ open: true, actions: () => holdOrder(item.id) })
          } else if (selectedAction === 'cancel') {
            setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) })
          } else {
            setAreYouSurePopup({ open: true, actions: () => confirmOrder(item.id) })
          }
        }}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'hold' 
            ? 'bg-yellow-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'hold' ? 'Hold' :
        selectedAction === 'cancel' ? 'Cancel' :
        'Confirm'}
      </button>

      <div className="relative">
        <button
          onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
          className="px-3 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-r-lg transition-all"
        >
          <ArrowDown size={20} />
        </button>

        {openDropdownId === item.id && (
          <div className="absolute top-full right-0 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {selectedAction !== 'confirm' && (
              <button
                onClick={() => {
                  setSelectedAction('confirm')
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Confirm
              </button>
            )}

            {selectedAction !== 'hold' && (
              <button
                onClick={() => {
                  setSelectedAction('hold')
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Hold
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => {
                  setSelectedAction('cancel')
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
// Pending Delivery Actions Component
export const PendingDeliveryActions = ({
  item,
  openDropdownId,
  setOpenDropdownId,
  selectedService,
  setSelectedService,
  setAreYouSurePopup,
  handlePendingDelivery,
  cancelOrder, // Default to an empty function if not provided
  shippingServices
}) => {
  const [localService, setLocalService] = useState(selectedService)

  return (
    <div className="relative flex">
      <button
        onClick={() => {
          if (localService) {
            setAreYouSurePopup({
              open: true,
              actions: () => handlePendingDelivery(item.id, localService)
            })
          }
        }}
        disabled={!localService}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          localService 
            ? 'bg-emerald-600 hover:bg-emerald-500' 
            : 'bg-gray-500 cursor-not-allowed'
        }`}
      >
        {localService || 'Services'}
      </button>

      <div className="relative">
        <button
          onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
          className="px-3 py-2 bg-slate-500 hover:bg-slate-400 text-white rounded-r-lg transition-all"
        >
          <ArrowDown size={20} />
        </button>

        {openDropdownId === item.id && (
          <div className="absolute top-full right-0 mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {shippingServices.map((service) => (
              <button
                key={service}
                onClick={() => {
                  setLocalService(service)
                  setSelectedService(service)
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                {service}
              </button>
            ))}
            <button
              onClick={() => {
                setAreYouSurePopup({
                  open: true,
                  actions: () => cancelOrder(item.id)
                })
                setOpenDropdownId(null)
              }}
              className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left border-t border-gray-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

