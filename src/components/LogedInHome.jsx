import React , {useEffect, useState} from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Sidebar from "@/components/Sidebar";
import Navbar from '@/components/Navbar';
import { useStateContext } from '@/contexts/ContextProvider';
import Home from '@/pages/Home';
import SignUp from '@/pages/SignUp';
import Login from '@/pages/Login';
import Orders from '@/pages/Orders';
import AddOrder from '@/pages/AddOrder';
import Itmes from '@/pages/Itmes';
import AddItem from '@/pages/AddItem'
import AddShipment from '@/pages/AddShipment';
import Storage from '@/pages/Storage';
import Dashboard from '@/pages/Dashboard';

const LogedInHome = () => {
    const {activeMenu} = useStateContext() ;
  return (
    <div >
        <BrowserRouter>
            <div className="flex relative bg-[#323949] ">
                
                { activeMenu ? (
                        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-[#323949]">
                            <Sidebar></Sidebar>
                        </div>
                    ) : (<div className=" w-0 dark:bg-secondary-dark-bg">
                        <Sidebar></Sidebar>
                    </div>)
                }

                {/* === END SIDE MENU === */}

                {/* NAV BAR */}
                <div className={ `dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72 ' : 'flex-2 '}` }>
                    <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                        <Navbar></Navbar>
                    </div>
                {/* === END NAV BAR === */}

                    <div>
                            <Routes>
                                {/* home */}
                                <Route path='/' element={<Home/>}/>

                                {/* accounts */}
                                <Route path='/signup' element={<SignUp/>}/>
                                <Route path='/login' element={<Login/>}/>
                                
                                {/* Order */}
                                <Route path='/orders' element={<Orders/>}/>
                                <Route path='/addorder' element={<AddOrder/>}/>
                                
                                {/* Itmes */}
                                <Route path='/items' element={<Itmes/>}/>
                                <Route path='/additem' element={<AddItem/>}/>
                                
                                {/* shipment */}
                                <Route path='/addShipment' element={<AddShipment/>}/>
                                <Route path='/Storage' element={<Storage/>}/>
                                
                                {/* DashBoard */}
                                <Route path='/dashboard' element={<Dashboard/>}/>
                                
                            </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    </div>
  )
}

export default LogedInHome
