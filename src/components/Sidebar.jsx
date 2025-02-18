import React, { useEffect, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button
} from '@mui/material';
import { useStateContext } from '../contexts/ContextProvider';
import { useLogin } from '@/contexts/LoginContext';
import "../App.css";
import { ArrowDown } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API;

export default function Sidebar() {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const { logout } = useLogin();
  const [expanded, setExpanded] = useState(null);

  const activeLink = "flex items-center gap-3 pl-4 py-2 rounded-lg text-white bg-[#3F465A]";
  const normalLink = "flex items-center gap-3 pl-4 py-2 rounded-lg text-gray-300 hover:bg-[#3F465A]";

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize > 900) {
      setActiveMenu(false);
    }
  };
  
  const [menuSections , setMenuSections] = useState([]) ;

  const sidebarViewPerms = async ()=>{
    const token = localStorage.getItem("token"); 
    try{
      const response = await axios.get(`${API}auth/view-perms`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
      setMenuSections(response.data)
      
    }catch(error){
      console.log(error);
    }
  }
  useEffect( ()=>{sidebarViewPerms();},[])
  
  return (
    activeMenu&&(
      <div
      className={`relative z-[1000] h-screen overflow-auto pb-10 bg-[#2A2F43] shadow-xl transition-all duration-300 ease-in-out scrollbar-custom md:translate-x-0 w-64`}
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center px-4 pt-4">
            <Link
              to="/"
              onClick={handleCloseSidebar}
              className="text-lg font-semibold text-gray-100"
            >
              Stores System
            </Link>
            <button
              onClick={() => setActiveMenu(false)}
              className="p-2 hover:bg-[#3F465A] rounded-full md:hidden"
            >
              <MdOutlineCancel className="text-red-400 text-2xl" />
            </button>
          </div>

          <div className="mt-4 px-2">
            {menuSections.map((section, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  color: '#fff',
                  '&:before': { display: 'none' },
                  margin: '4px 0'
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDown className='text-[#9CA3AF]' />}
                  sx={{
                    minHeight: '48px',
                    '& .MuiAccordionSummary-content': { margin: '4px 0' },
                    backgroundColor: expanded === `panel${index}` ? '#3F465A' : 'transparent',
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#3F465A' }
                  }}
                >
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {section.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ padding: '0 8px 8px' }}>
                  {section.items.map((item, itemIndex) => (
                    <NavLink
                      key={itemIndex}
                      to={item.path}
                      onClick={handleCloseSidebar}
                      className={({ isActive }) => 
                        isActive ? activeLink : normalLink
                      }
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: '0.875rem',
                          padding: '8px 0',
                          width: '100%'
                        }}
                      >
                        {item.label}
                      </Typography>
                    </NavLink>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
            
            <div className="bottom-0 w-full p-4 bg-[#2A2F43] border-t border-[#3F465A]">
              <Button
                fullWidth
                onClick={logout}
                sx={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  '&:hover': { backgroundColor: '#DC2626' },
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 1
                }}
              >
                Logout
              </Button>
            </div>
          </div>


        </>
      )}
    </div>
    )
  );
}