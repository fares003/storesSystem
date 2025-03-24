import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import axios from "axios";

const API = import.meta.env.VITE_API;

function Settings() {
  const [settings, setSettings] = useState([
    { name: "Inventory name", editing: false, defaultValue: "" },
    { name: "PDF width", editing: false, defaultValue: "0" },
    { name: "PDF height", editing: false, defaultValue: "0" },
  ]);

  const [inventories, setInventories] = useState([]);

  // Handle text field changes
  const handleInput = (e, index) => {
    const newSettings = [...settings];
    newSettings[index].defaultValue = e.target.value;
    localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  // Handle dropdown selection (Save ID instead of name)
  const handleInventoryChange = (e) => {
    const selectedInventoryId = e.target.value;

    const newSettings = [...settings];
    newSettings[0].defaultValue = selectedInventoryId; // Store the ID
    localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const handleSave = (index) => {
    const newSettings = [...settings];
    newSettings[index].editing = false;
    localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("settings"));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  useEffect(() => {
    const getInventories = async () => {
      const target = `${API}OutboundOrders/own-inventories`;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(target, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setInventories(response.data);
        } else {
          console.error("Failed to fetch inventories.");
        }
      } catch (error) {
        console.error("Error fetching inventories:", error);
      }
    };
    getInventories();
  }, []);

  const handleEdit = (index) => {
    const newSettings = [...settings];
    newSettings[index].editing = true;
    setSettings(newSettings);
  };

  return (
    <div className="w-full h-screen flex items-center flex-col text-white p-8">
      <div className="w-full flex bg-[#525969] pt-5 rounded-md items-center flex-col gap-y-4">
        <div className="w-full flex items-center justify-center gap-x-4">
          <h1 className="text-2xl font-bold">Settings</h1>
          <IoIosSettings size={45} />
        </div>
        <div className="w-full flex items-center flex-col max-w-xl mx-6">
          {settings.map((setting, index) => (
            <div key={setting.name} className="mb-4 w-full flex items-center justify-center gap-x-4">
              <div className="mb-4">
                <label htmlFor={setting.name} className="block text-sm font-medium mb-2">
                  {setting.name}:
                </label>

                {/* Dropdown for "Inventory Id" */}
                {setting.name === "Inventory name" ? (
   <select
   id={setting.name}
   className={`bg-transparent p-2 mr-9  rounded text-white outline-none w-full max-w-[300px] ${
     setting.editing ? "cursor-pointer border focus:border-white" : "cursor-not-allowed opacity-50"
   }`}
   value={setting.defaultValue}
   disabled={!setting.editing}
   onChange={handleInventoryChange}
 >
   <option value="" disabled>Select an inventory</option>
   <div className="max-h-48 overflow-y-auto">
     {inventories.map((inventory) => (
       <option key={inventory.id} className="bg-gray-800 text-white hover:bg-gray-600" value={inventory.id}>
         {inventory.manager}
       </option>
     ))}
   </div>
 </select>
 
                ) : (
                  <input
                    id={setting.name}
                    type="text"
                    value={setting.defaultValue}
                    className={`bg-transparent p-2 rounded text-white outline-none ${
                      setting.editing ? "cursor-text border focus:border-white" : "cursor-not-allowed opacity-50"
                    }`}
                    readOnly={!setting.editing}
                    disabled={!setting.editing}
                    onChange={(e) => handleInput(e, index)}
                  />
                )}
              </div>

              {/* Change Button */}
              <button
                className={`px-6 py-2 rounded-3xl ${
                  setting.editing
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-transparent text-black opacity-70 border border-black hover:bg-black hover:text-white hover:opacity-100 transition-all duration-300"
                }`}
                onClick={() => handleEdit(index)}
                disabled={setting.editing}
              >
                {setting.editing ? "Editing..." : "Change"}
              </button>

              {/* Save Button */}
              <button
                className={`px-6 py-2 bg-green-500 text-white font-semibold rounded-3xl ${
                  setting.editing ? "" : "hidden"
                } ${setting.editing ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => handleSave(index)}
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
