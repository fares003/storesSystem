import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Notifications from '@/components/Notifications';
import { useStateContext } from '@/contexts/ContextProvider';
import Home from '@/pages/Home';
import SignUp from '@/pages/SignUp';
import Login from '@/pages/Login';
import Orders from '@/pages/Orders';
import AddOrder from '@/pages/AddOrder';
import Items from '@/pages/Items';
import AddItem from '@/pages/AddItem';
import AddShipment from '@/pages/AddShipment';
import Dashboard from '@/pages/Dashboard';
import PrepareToShipment from '@/pages/PrepareToShipment';
import Admin from '@/pages/Admin';
import Permission from '@/pages/Permission';
import OrderPreview from '@/pages/OrderPreview';
import ShipmentPreview from '@/pages/ShipmentPreview';
import InboundOrders from '@/pages/InboundOrders';
import OutboundOrders from '@/pages/OutboundOrders';
import ViewInventory from '@/pages/ViewInventory';
import Financial from '@/pages/Financial';
import Deliver from '@/pages/Deliver';
import GovPrices from '@/pages/GovPrices';
import ShippingServices from '@/pages/ShippingServices';
import Myshipments from '@/pages/Myshipments';
import PerformancePage from '@/pages/PerformancePage';
import SupplierData from '@/pages/SupplierData';
import Transfer from '@/pages/Transfer';
import TransferRequests from '@/pages/TransferRequests';
import DispatchBulk from '@/pages/DispatchBulk';
import ReadyOrders from '@/pages/ReadyOrders';
import Employee from '@/pages/Employee';
import CreateInventory from '@/pages/CreateInventory';
import Bulks from '@/pages/Bulks';

const LogedInHome = () => {
  const { activeMenu } = useStateContext();

  return (
    <div>
      <BrowserRouter>
        <div className="flex relative bg-[#323949]">
          {/* Sidebar */}
        {activeMenu ? (
          <div className="z-20 w-64 fixed sidebar dark:bg-secondary-dark-bg bg-[#323949] transition-all duration-300 ease-in-out">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 fixed sidebar dark:bg-secondary-dark-bg bg-[#323949] transition-all duration-300 ease-in-out transform -translate-x-full">
            <Sidebar />
          </div>
        )}

          {/* Notifications */}
          <Notifications />

          {/* Main Content */}
          <div
            className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
              activeMenu ? 'md:ml-64' : 'flex-2'
            }`}
          >
            {/* Navbar */}
            <div className="z-30 md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>

            {/* Pages */}
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/addorder" element={<AddOrder />} />
                <Route path="/items" element={<Items />} />
                <Route path="/additem" element={<AddItem />} />
                <Route path="/addShipment" element={<AddShipment />} />
                <Route path="/Inbound" element={<InboundOrders />} />
                <Route path="/Outbound" element={<OutboundOrders />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/prepareToShipment" element={<PrepareToShipment />} />
                <Route path="/adminpanel" element={<Admin/>} />
                <Route path="/permission" element={<Permission/>} />
                <Route path="/OrderPreview" element={<OrderPreview/>} />
                <Route path="/Shipment" element={<ShipmentPreview/>} />
                <Route path="/viewInventory" element={<ViewInventory/>} />
                <Route path="/financial" element={<Financial/>} />
                <Route path="/deliverInbound" element={<Deliver/>} />
                <Route path="/GovPrices" element={<GovPrices/>} />
                <Route path="/Shipping" element={<ShippingServices/>} />
                <Route path="/Myshipments" element={<Myshipments/>} />
                <Route path="/performance-details/:index" element={<PerformancePage/>}/>
                <Route path="/supplierData" element={<SupplierData />} />
                <Route path="/InventoryTransfer" element={<Transfer />} />
                <Route path="/TransferRequests" element={<TransferRequests />} />
                <Route path="/outbounds/get-bulk" element={<DispatchBulk />} />
                <Route path="/Ready-orders" element={<ReadyOrders />} />
                <Route path="/Employee" element={<Employee />} />
                <Route path="/CreateInventory" element={<CreateInventory />} />
                <Route path="/bulks" element={<Bulks />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default LogedInHome;
