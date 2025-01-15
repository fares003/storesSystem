import {useEffect} from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useStateContext } from '../contexts/ContextProvider'
import avatar from "../assets/react.svg"
import { FaBars } from 'react-icons/fa';

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
  return (
    <div className="flex items-center justify-between p-2 md:mx-6 relative">
      <FaBars className='cursor-pointer text-2xl text-white' onClick={()=>{setActiveMenu(!activeMenu)}}/>
      <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg" >
        <img src={avatar} className="rounded-full w-8 h-8" />
        <p><span className="text-gray-400 text-14">Hi,</span> <span className="text-gray-400 font-bold ml-1 text-14">Admin</span></p>
      </div>

    </div>
  )
}
