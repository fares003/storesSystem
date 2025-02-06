import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { useStateContext } from '../contexts/ContextProvider';
import { useLogin } from '@/contexts/LoginContext';
import "../App.css"
export default function Sidebar() {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const activeLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-400 hover:text-slate-500 hover:bg-light-gray m-2";

  const HandelColseSidebar = () => {
    if (activeMenu && screenSize > 900) {
      setActiveMenu(false);
    }
  };
  const {logout} = useLogin() ;
  return (
    <div
      className={`relative z-[1000] ml-3 h-screen overflow-auto pb-10 shadow-lg transition-all duration-300 ease-in-out scrollbar-custom 
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
              <p className="text-gray-50 m-3 mt-4 uppercase">
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
              <p className="text-gray-50 m-3 mt-4 uppercase">
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
              <p className="text-gray-50 m-3 mt-4 uppercase">
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
              <p className="text-gray-50 m-3 mt-4 uppercase">
                Storage
              </p>
              <NavLink
                to={`/Inbound`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Inbound</span>
              </NavLink>

              <NavLink
                to={`/Outbound`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Outbound</span>
              </NavLink>

              <NavLink
                to={`/addShipment`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">Add inbound order</span>
              </NavLink>

            </div>
            <div>

              <p className="text-gray-50 m-3 mt-4 uppercase">
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

            <div>

              <p className="text-gray-50 m-3 mt-4 uppercase">
                inventory 
              </p>
              <NavLink
                to={`/viewInventory`}
                onClick={HandelColseSidebar}
                className={({ isActive }) => isActive ? `${activeLink} bg-[#3F465A]` : normalLink}
              >
                <span className="capitalize">View & Create</span>
              </NavLink>

            </div>

          </div>
        </>
      )}
      <div className='w-24 h-8 flex items-center justify-center cursor-pointer rounded-2xl bg-red-600 sticky bottom-[-30px] float-right mx-2 hover:bg-red-800 text-white' onClick={()=>{logout()}}>
        logout
      </div>
    </div>
  );
}
