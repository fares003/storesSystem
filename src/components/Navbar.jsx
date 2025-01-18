import {useEffect} from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useStateContext } from '../contexts/ContextProvider'
import avatar from "../assets/react.svg"
import { FaBars } from 'react-icons/fa';
import { useLogin } from '@/contexts/LoginContext';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const {activeMenu , setActiveMenu ,screenSize ,setScreenSize } = useStateContext() ; 
  useEffect(()=>{
    let handleRezise = () =>{
      setScreenSize(window.innerWidth)
    }
    window.addEventListener("resize" , handleRezise);
    handleRezise() ;

    return ()=>{ window.removeEventListener('resize' ,handleRezise)}
  } , [])
  useEffect(()=>{
    if(screenSize <= 900){
      setActiveMenu(false)
    }
    else{
      setActiveMenu(true)
    }
  } , [screenSize])
  const {logedin} = useLogin() ; 
  return (
    (
      logedin ? 

      <div className="flex items-center justify-between p-2 md:mx-6 relative">
        <FaBars className='cursor-pointer text-2xl text-white' onClick={()=>{setActiveMenu(!activeMenu)}}/>
        <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg" >
          <img src={avatar} className="rounded-full w-8 h-8" />
          <p><span className="text-gray-400 text-14">Hi,</span> <span className="text-gray-400 font-bold ml-1 text-14">Admin</span></p>
        </div>
      </div> : 
      
      <div className=" text-white flex items-center justify-between p-2 md:mx-6 relative">
        
        
        <NavLink to={`/`}>
          <div className='italic font-semibold text-2xl'>
            StoresSystem 
          </div>
        </NavLink>
        
        <div className="flex items-center gap-4 cursor-pointer p-1 hover:bg-light-gray rounded-lg text-lg" >
          <NavLink to={`/`}>
            <span className="capitalize">Contact</span>
          </NavLink>
          
          <NavLink to={`/login`}>
            <span className="capitalize">Log in</span>
          </NavLink>
          
          <NavLink to={`/signup`}>
            <span className="capitalize">Sign up</span>
          </NavLink>
        </div>
      </div>
    )
  )
}
