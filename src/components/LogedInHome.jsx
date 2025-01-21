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
import Storage from '@/pages/Storage';
import Dashboard from '@/pages/Dashboard';
import PrepareToShipment from '@/pages/PrepareToShipment';
import Admin from '@/pages/Admin';

const LogedInHome = () => {
  const { activeMenu } = useStateContext();

  return (
    <div>
      <BrowserRouter>
        <div className="flex relative bg-[#323949]">
          {/* Sidebar */}
        {activeMenu ? (
          <div className="z-20 w-72 fixed sidebar dark:bg-secondary-dark-bg bg-[#323949] transition-all duration-300 ease-in-out">
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
              activeMenu ? 'md:ml-72' : 'flex-2'
            }`}
          >
            {/* Navbar */}
            <div className="z-30 fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
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
                <Route path="/Storage" element={<Storage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/prepareToShipment" element={<PrepareToShipment />} />
                <Route path="/adminpanel" element={<Admin/>} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default LogedInHome;
