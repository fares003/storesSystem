import React from 'react'
import {Link , NavLink} from "react-router-dom" 
import {MdOutlineCancel} from "react-icons/md"
import { useStateContext } from '../contexts/ContextProvider'

export default function Sidebar() {
  const {activeMenu , setActiveMenu , screenSize } = useStateContext() ;
  const activeLink = "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2"
  const normalLink = "flex item-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-400 hover:text-slate-500 hover:bg-light-gray m-2"
  
  const HandelColseSidebar = ()=>{
    if(activeMenu && screenSize > 900){
      setActiveMenu(false)
    }
  }

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 shadow-[10px_0px_10px_rgba(255,255,255,0.1)]">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={ HandelColseSidebar } className="items-center gap-3 ml-3 mt-4 flex text-xl font-semibold tracking-tight text-stone-300" >
              <span>stores system</span>
            </Link>
              <button type="button" onClick={()=>setActiveMenu(false) } className="text-3xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden">
                <MdOutlineCancel className='text-red-400' onClick={()=>setActiveMenu(false) }/>
              </button>
          </div>
          <div className="mt-10 ">
                {
                  // <div >
                  // <p className="text-slate-900 m-3 mt-4 uppercase" >
                  //   account 
                  // </p>
                  //     <NavLink to={`/signup`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                  //       {/* {link.icon} */}
                  //       <span className="capitalize">Sign up</span>
                  //     </NavLink>

                  //     <NavLink to={`/login`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                  //       {/* {link.icon} */}
                  //       <span className="capitalize">Login</span>
                  //     </NavLink>
                  // </div>
                }

                <div >
                  <p className="text-slate-900 m-3 mt-4 uppercase" >
                    Orders
                  </p>
                      <NavLink to={`/orders`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                        {/* {link.icon} */}
                        <span className="capitalize">Orders</span>
                      </NavLink>

                      <NavLink to={`/addorder`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                        {/* {link.icon} */}
                        <span className="capitalize">add Order</span>
                      </NavLink>
                </div>


                <div >
                  <p className="text-slate-900 m-3 mt-4 uppercase" >
                    Items
                  </p>
                      <NavLink to={`/items`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                        {/* {link.icon} */}
                        <span className="capitalize">items</span>
                      </NavLink>

                      <NavLink to={`/additem`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                        {/* {link.icon} */}
                        <span className="capitalize">add item</span>
                      </NavLink>
                </div>
                <div >
                  <p className="text-slate-900 m-3 mt-4 uppercase" >
                    Storage
                  </p>
                      <NavLink to={`/Storage`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                        {/* {link.icon} */}
                        <span className="capitalize">Storage</span>
                      </NavLink>

                      <NavLink to={`/addShipment`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                        {/* {link.icon} */}
                        <span className="capitalize">add Shipment</span>
                      </NavLink>
                </div>

                <div >
                  <p className="text-slate-900 m-3 mt-4 uppercase" >
                    Dashboard
                  </p>
                  <NavLink to={`/dashboard`} onClick={HandelColseSidebar} style={({isActive})=>(isActive ? {backgroundColor:"#3F465A"} : {backgroundColor:""})} className={({isActive})=> isActive ? activeLink : normalLink  }>
                    {/* {link.icon} */}
                    <span className="capitalize">dashboard</span>
                  </NavLink>
                </div>
          </div>
        </>
      )}
    </div>
  )
}