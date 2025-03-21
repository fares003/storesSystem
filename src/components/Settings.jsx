import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { use } from 'react';
import { IoIosSettings } from "react-icons/io";

function Settings() {

const [settings, setSettings] = useState([
    {name:"Inventory Id",editing:false,defaultValue:""},
    {name:"PDF width",editing:false,defaultValue:""},
    {name:"PDF height",editing:false,defaultValue:""},
]);
const handleInput = (e, index) => {
    const newSettings = [...settings];
    newSettings[index].defaultValue = e.target.value;
    localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
}
const handleSave = (index) => {
       
    const newSettings = [...settings];
    newSettings[index].editing = false;
     localStorage.setItem("settings", JSON.stringify(newSettings));
    setSettings(newSettings);
      
}
useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (settings) {
        setSettings(settings);
    }
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
            <div className="w-full flex items-center flex-col max-w-xl mx-6 ">
                {settings.map((setting, index) => (
                    <div key={setting.name} className="mb-4 w-full flex items-center justify-center gap-x-4">
                        <div className="mb-4">
                            <label htmlFor={setting.name} className="block text-sm font-medium mb-2">
                                {setting.name}:
                            </label>
                            <input
                                id={setting.name}
                                type="text"
                                defaultValue={setting.defaultValue}
                                className={`bg-transparent p-2 rounded text-white outline-none ${
                                    setting.editing ? 'cursor-text border focus:border-white' : 'cursor-not-allowed opacity-50'
                                }`}
                                placeholder={setting.name}
                                readOnly={!setting.editing}
                                disabled={!setting.editing}
                                onChange={(e) => handleInput(e, index)}
                            />
                        </div>
                        <button
                            className={`px-6 py-2 rounded-3xl ${
                                setting.editing
                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    : 'bg-transparent text-black opacity-70 border border-black hover:bg-black hover:text-white hover:opacity-100 transition-all duration-300'
                            }`}
                            onClick={() => handleEdit(index)}
                            disabled={setting.editing}
                        >
                            {setting.editing ? 'Editing...' : 'Change'}
                        </button> 
                        <button className={`px-6 py-2 bg-green-500 text-white font-semibold rounded-3xl ${
                            setting.editing ? '' : 'hidden'
                        } ${setting.editing ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}  onClick={() => handleSave(index)}>
                            Save
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
}

export default Settings