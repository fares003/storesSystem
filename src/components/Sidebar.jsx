import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from '../contexts/ContextProvider';

export default function Sidebar() {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const activeLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-400 hover:text-slate-500 hover:bg-light-gray m-2";

  const HandelColseSidebar = () => {
    if (activeMenu && screenSize > 900) {
      setActiveMenu(false);
    }
  };

  return (
    <div
      className={`z-[1000] ml-3 h-screen md:overflow-auto overflow-auto pb-10 shadow-lg transition-all duration-300 ease-in-out scrollbar-thumb-slate-800 scrollbar-thin scrollbar-track-gray-300 
        ${activeMenu ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center ">
            <Link to="/" onClick={HandelColseSidebar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-semibold tracking-tight text-stone-300">
              <span>stores system</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu(false)}
              className="text-3xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel className='text-red-400' />
            </button>
          </div>

          <div className="mt-10 overflow-y-auto">
            {/* Dashboard Section */}
            <div>
              <p className="text-slate-900 m-3 mt-4 uppercase">
                Dashboard
              </p>
              <NavLink
                to={`/dashboard`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">dashboard</span>
              </NavLink>
            </div>

            {/* Orders Section */}
            <div>
              <p className="text-slate-900 m-3 mt-4 uppercase">
                Orders
              </p>
              <NavLink
                to={`/orders`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Orders</span>
              </NavLink>

              <NavLink
                to={`/addorder`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Add Order</span>
              </NavLink>
            </div>

            {/* Items Section */}
            <div>
              <p className="text-slate-900 m-3 mt-4 uppercase">
                Items
              </p>
              <NavLink
                to={`/items`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Items</span>
              </NavLink>

              <NavLink
                to={`/additem`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Add Item</span>
              </NavLink>
            </div>

            {/* Storage Section */}
            <div>
              <p className="text-slate-900 m-3 mt-4 uppercase">
                Storage
              </p>
              <NavLink
                to={`/Storage`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Storage</span>
              </NavLink>

              <NavLink
                to={`/addShipment`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Add Shipment</span>
              </NavLink>

            </div>
            <div>

              <p className="text-slate-900 m-3 mt-4 uppercase">
                admin panel
              </p>
              <NavLink
                to={`/adminpanel`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">mange Authority</span>
              </NavLink>

              <NavLink
                to={`/permission`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">permissions</span>
              </NavLink>

            </div>

          </div>
        </>
      )}
    </div>
  );
}
