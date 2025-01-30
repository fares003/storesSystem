import { useStateContext } from '@/contexts/ContextProvider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';

const API = import.meta.env.VITE_API;

const Notifications = () => {
  const { activeNotification, setActiveNotification  , setNewNotification ,} = useStateContext();
  const [notificationsData, setNotificationsData] = useState([]);


  const fetchNotifications = async () => {
    const target = `${API}Notifications`;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(target, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        if (response.data.length !== notificationsData.length) {
          const newNotifs = response.data.length - notificationsData.length;
          setNewNotification(newNotifs); 
        }
        setNotificationsData(response.data);
      } else {
        console.error("Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
      
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div
      className={`fixed top-0 right-0 w-80 h-screen bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
        activeNotification ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaBell className="text-yellow-400" /> Notifications
        </h2>
        <button
          onClick={() => setActiveNotification(false)}
          className="text-2xl text-red-500 hover:text-red-700"
        >
          <MdOutlineCancel />
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-4">
        {notificationsData.length > 0 ? (
          notificationsData.slice().reverse().map((notif) => (
            <div
              key={notif.id}
              className="mb-4 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200"
            >
              <h3 className="font-semibold text-gray-800">{notif.title}</h3>
              <p className="text-sm text-gray-600">{notif.message}</p>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
