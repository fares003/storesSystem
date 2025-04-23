import { PendingDeliveryActions } from "./ActionComponents";
import UniversalOrderActions from "./UniversalOrderActions";

// utils/orderActionsConfig.ts
export const buildActionsConfig = ({
    cancelOrder,
    createInvoice,
    confirmOrder,
    holdOrder,
  }) => ({
    /**  Already‑finished examples  */
    New: ({ item }) => (
      <UniversalOrderActions
        item={item}
        onCancel={cancelOrder}
        onInvoice={createInvoice}
        extraActions={[
          { key: 'confirm', label: 'Confirm', onClick: () => confirmOrder(item.id) },
          { key: 'hold',    label: 'Hold',    onClick: () => holdOrder(item.id) },
        ]}
      />
    ),
  
    'pending delivery': ({ item }) => (
      <UniversalOrderActions
        item={item}
        onCancel={cancelOrder}
        onInvoice={createInvoice}
        /* supply any additional buttons */
      />
    ),
  
    /**  Every other status gets default Cancel + Invoice automatically */
    Confirmed:     UniversalOrderActions,
    Cancelled:     UniversalOrderActions,
    'In preparation': UniversalOrderActions,
    'Ready for Shipping': UniversalOrderActions,
    'ready for shipment': UniversalOrderActions,
    'In Transit':  UniversalOrderActions,
    Delivered:     UniversalOrderActions,
    Returned:      UniversalOrderActions,
    'Partially Delivered': PendingDeliveryActions,
    Complete:      UniversalOrderActions,
    'pending preparation': UniversalOrderActions,
    hold:          UniversalOrderActions,
  });
  