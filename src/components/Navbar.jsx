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

  // useEffect(()=>{
  //   handlOnOff();
  // },[isOn])

  const handlOnOff = async ()=>{
    const token = localStorage.getItem("token");
    const target = isOn ? `${API}Auth/sign-off` : `${API}Auth/sign-on` ;

    try{
      const response = await axios.get(target, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      toast.success("status changed")
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
              onClick={() => setIsOn(!isOn)}
              className={`relative w-14 h-7 flex items-center px-1 rounded-full transition-all duration-300 
                ${isOn ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span
                className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 
                  ${isOn ? "translate-x-8" : "translate-x-0"}`}
              ></span>
              <span className={`absolute left-3 text-sm font-semibold text-white transition-opacity duration-300 ${isOn ? "opacity-100" : "opacity-0"}`}>
                On
              </span>
              <span className={`absolute right-3 text-sm font-semibold text-gray-600 transition-opacity duration-300 ${isOn ? "opacity-0" : "opacity-100"}`}>
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
