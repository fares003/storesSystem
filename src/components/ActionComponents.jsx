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
  cancelOrder,
  invoiceOrder
}) => {
  return (
    <div className="relative flex">
      <button
        onClick={() => {
          if (selectedAction === 'hold') {
            setAreYouSurePopup({ open: true, actions: () => holdOrder(item.id) })
          } else if (selectedAction === 'cancel') {
            setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) })
          } else if (selectedAction === 'confirm') {
            setAreYouSurePopup({ open: true, actions: () => confirmOrder(item.id) })
          }else{
            setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) })
          }
        }}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'hold' 
            ? 'bg-yellow-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            :selectedAction==='confirm'?
             'bg-indigo-600 hover:bg-indigo-500':
              'bg-orange-500 hover:bg-orange-500'
        }`}
      >
        {selectedAction === 'hold' ? 'Hold' :
        selectedAction === 'cancel' ? 'Cancel' :
        selectedAction === 'confirm' ? 'Confirm' : 'Invoice'}
        
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
                    {selectedAction !== 'invoice' && (
              <button
                onClick={() => {
                  setSelectedAction('invoice')
                  setOpenDropdownId(null)
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              > 
                invoice
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
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const pendingPreparationOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const canceledOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const inPreparationOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const holdActionOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const PendingDeliveryActions = ({
  item,
  openDropdownId,
  setOpenDropdownId,
  selectedService,
  setSelectedService,
  setAreYouSurePopup,
  handlePendingDelivery,
  cancelOrder, // Default to an empty function if not provided
  shippingServices,
  invoiceOrder
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
                  actions: () => invoiceOrder(item.id)
                })
                setOpenDropdownId(null)
              }}
              className="block w-full px-4 py-2 text-sm  hover:bg-red-100 text-left border-t border-gray-200"
            >
              invoice
            </button>
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
export const completeActionOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const PartiallyDeliveredActionOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const ReturnedActionOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const deliveredActionOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export const readyForShipmentActionOrderActions = ({
  item,
  selectedAction,
  setSelectedAction,
  openDropdownId,
  setOpenDropdownId,
  setAreYouSurePopup,
  confirmOrder,
  holdOrder,
  cancelOrder,
  invoiceOrder
}) => {
  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setOpenDropdownId(null);
    console.log('Selected action:', action); // This will show the correct value
  };

  const handleMainButtonClick = () => {
    if (selectedAction === 'cancel') {
      setAreYouSurePopup({ open: true, actions: () => cancelOrder(item.id) });
    } else if (selectedAction === 'invoice') {
      setAreYouSurePopup({ open: true, actions: () => invoiceOrder(item.id) });
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={handleMainButtonClick}
        className={`px-4 py-2 text-white rounded-l-lg text-sm transition-all ${
          selectedAction === 'invoice' 
            ? 'bg-orange-500 hover:bg-yellow-600' 
            : selectedAction === 'cancel' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {selectedAction === 'invoice' ? 'Invoice' : 'Cancel'}
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
            {selectedAction !== 'invoice' && (
              <button
                onClick={() => handleActionSelect('invoice')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
              >
                Invoice
              </button>
            )}
            
            {selectedAction !== 'cancel' && (
              <button
                onClick={() => handleActionSelect('cancel')}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left border-t border-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};