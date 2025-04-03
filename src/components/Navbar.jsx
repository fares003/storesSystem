import { useEffect, useState } from 'react';
import { MdNotifications } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { useLogin } from '@/contexts/LoginContext';
import avatar from "../assets/react.svg";
import axios from 'axios';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API;

export default function Navbar() {
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    setScreenSize,
    activeNotification,
    setActiveNotification,
    newNotification ,
    setNewNotification, 
  } = useStateContext();

  const [isOn, setIsOn] = useState(false);


  const handleOn = async ()=>{
    const token = localStorage.getItem("token");
    const target = `${API}Auth/sign-on` ;

    try{
      const response = await axios.get(target, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      if(response.status === 200){
        setIsOn(true);
      }
    }catch(error){
      console.log(error);
      toast.error("faild to change status")
    }
  }
  const handleOff = async ()=>{
    const token = localStorage.getItem("token");
    const target =  `${API}Auth/sign-off` ;

    try{
      const response = await axios.get(target, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      if(response.status === 200){
        setIsOn(false);
      }
    }catch(error){
      console.log(error);
      toast.error("faild to change status")
    }
  }
  const { logedin} = useLogin();
  const username = localStorage.getItem("username")
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center gap-4">
        {logedin && (
          <FaBars
            className="cursor-pointer text-2xl"
            onClick={() => setActiveMenu(!activeMenu)}
          />
        )}
        <NavLink to="/">
          <div className="italic font-semibold text-xl">
            StoresSystem
          </div>
        </NavLink>
      </div>

      {logedin ? (
        <div className="flex items-center gap-6">
          {/* sign on sigin off  */}
          <div>
  <button
    onClick={isOn ? handleOff : handleOn} // Toggle between On and Off
    className={`relative w-16 h-8 flex items-center px-1 rounded-full transition-all duration-300 
      ${isOn ? "bg-green-500" : "bg-red-500"}`} // Green for "On", Red for "Off"
  >
    <span
      className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 
        ${isOn ? "translate-x-8" : "translate-x-0"}`} // Toggle position of the slider
    ></span>
    <span
      className={`absolute left-2 text-xs font-semibold text-white transition-opacity duration-300 
        ${isOn ? "opacity-100" : "opacity-0"}`} // Show "On" text when active
    >
      On
    </span>
    <span
      className={`absolute right-2 text-xs font-semibold text-white transition-opacity duration-300 
        ${isOn ? "opacity-0" : "opacity-100"}`} // Show "Off" text when inactive
    >
      Off
    </span>
  </button>
</div>

          <div
            className="relative cursor-pointer"
            onClick={() => {setActiveNotification(!activeNotification) ; setNewNotification(0) ;}}
          >
            <MdNotifications className="text-2xl" />
            {
              newNotification !=0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {newNotification}
                  </span>
                )
            }
          </div>
          
          <div className="flex items-center gap-2">
            <p className="text-sm">
              <span className="text-gray-400">Hi,</span>{' '}
              <span className="font-bold">{username}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="capitalize text-sm hover:text-yellow-400"
          >
            Contact
          </NavLink>
          <NavLink
            to="/login"
            className="capitalize text-sm hover:text-yellow-400"
          >
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="capitalize text-sm hover:text-yellow-400"
          >
            Sign up
          </NavLink>
        </div>
      )}
    </div>
  );
}
