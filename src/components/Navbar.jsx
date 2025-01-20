import { useEffect } from 'react';
import { MdNotifications } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { useLogin } from '@/contexts/LoginContext';
import avatar from "../assets/react.svg";

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

  const { logedin } = useLogin();

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
            <img src={avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
            <p className="text-sm">
              <span className="text-gray-400">Hi,</span>{' '}
              <span className="font-bold">Admin</span>
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
