import React, { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { toast } from 'react-toastify';
import { set } from 'zod';
import axios from "axios";

function EndOfDay() {
  const [barcodeValue, setBarcodeValue] = useState(' '); // Default barcode value
  const [id, setId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const API = import.meta.env.VITE_API;
  const [companies,setCompanies]=useState([]);
  const [selectedCompany, setSelectedCompany] = useState(0);
 useEffect(() => {
    const res = JSON.parse(localStorage.getItem("settings"));
    const Id=res[0].defaultValue;
    if (Id) {
        setId(Id);
    }else{
        setErrorMsg("there is no id please go to settings and add your id");

    }
}, []);
useEffect(() => {
  const fetchCompanies= async () => {
  try {
    const token = localStorage.getItem("token");
    const target = `${API}Gov/companies`;
    const response = await axios.get(target, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    setCompanies(data);
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};
fetchCompanies();
}, []);
const handleEndTheDay = async() => {
  if (id) {
    if(!selectedCompany){
      toast.error("please select a company")
      return;
    }
    console.log("first")
    const token = localStorage.getItem("token");
    const target = API + `OutboundOrders/end-of-day`;
    const resp = await axios.post(target, 
      {
        invId:id,
        companyId:selectedCompany

      },
      {
      headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
      },
    })
    setBarcodeValue(resp.data.barcode);
  }else{
toast.error(errorMsg);
  }


}
  return (
    <div className="w-full h-screen flex items-center justify-center text-white">
      <div className="w-full flex items-center flex-col max-w-xl mx-6">
        <h1 className="text-2xl font-bold mb-6" >End of day</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={handleEndTheDay}>
            End the day
          </button>
          <select name="" id="" value={selectedCompany||""} onChange={(e) => setSelectedCompany(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded outline-0 text-black">
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        <div className="mb-6 bg-white p-4">
          <Barcode value={barcodeValue} format="CODE128" />
        </div>

      </div>
    </div>
  );
}

export default EndOfDay;