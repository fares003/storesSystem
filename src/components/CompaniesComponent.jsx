import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CiExport } from "react-icons/ci";
import { CiImport } from "react-icons/ci";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API;

function CompaniesComponent() {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    city: "",
    governorate: "",
    contactPhone: "",
    contactName: "",
  });
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const target = API + `Gov/companies`;
        const response = await axios.get(target, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleActive = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to activate this Company",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, activate!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        const target = API + `Gov/companies/activate`;
        const response = await axios.post(
          target,
          { id: id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          const updatedCompanies = companies.map((company) =>
            company.id === id ? { ...company, active: true } : company
          );
          setCompanies(updatedCompanies);
          Swal.fire("Activated!", "The company has been activated.", "success");
        } else {
          Swal.fire("Error!", "Failed to activate the company.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to activate the company.", "error");
      }
    }
  };

  const handleAddCompany = () => {
    setShowAddCompanyModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const target = API + `Gov/companies/create`;
      const response = await axios.post(
        target,
        {
          name: newCompany.name,
          address: newCompany.address,
          city: newCompany.city,
          governorate: newCompany.governorate,
          contactPhone: newCompany.contactPhone,
          contactName: newCompany.contactName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setCompanies([...companies, response.data]);
        setNewCompany({
          name: "",
          address: "",
          city: "",
          governorate: "",
          contactPhone: "",
          contactName: "",
        });
        setShowAddCompanyModal(false);
        Swal.fire("Success!", "Company added successfully!", "success");
      }
    } catch (error) {
      console.error("Error adding company:", error);
      Swal.fire("Error!", "Failed to add company.", "error");
    }
  };
  const fileInputRef = useRef(null);
  
    const handleButtonClick = () => {
      fileInputRef.current.click();
    };
  
  const handleExportExcel = async(orderId) => {
    try {
      const response = await axios.get(`${API}Shipping/create-report/${orderId}`, {
        responseType: 'blob',
      });
      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, '_blank');
    }catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Check if file is Excel
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Please upload an Excel file (.xlsx, .xls, or .csv)');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file); // Changed from 'excelFile' to 'file' to match your backend
  
    try {
      const response = await axios.post(`${API}Shipping/company/report`, formData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 200) { // Changed from response.ok to response.status
        toast.success('File imported successfully!');
        // Reset the file input
        e.target.value = ''; // This allows selecting the same file again
        setFileInputKey(Date.now()); // Force re-render if needed
      } else {
        toast.error('Something went wrong, please try again later');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Import failed: something went wrong please try again later`);
      e.target.value = ''; // Clear on error too
    }
  };
  return (
    <div className="text-white p-5 bg-[#1E293B] rounded-md m-5 shadow-lg">
      <h2 className="text-xl font-bold text-center text-[#FACC15] mb-4">
        Companies List
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 bg-[#0F172A] text-left border-collapse text-[#E2E8F0]">
          <thead className="bg-[#334155] text-white">
            <tr className="border-b-2 border-gray-700">
              <th className="p-3 text-md font-bold text-center">ID</th>
              <th className="p-3 text-md font-bold text-center">Name</th>
              <th className="p-3 text-md font-bold text-center">Address</th>
              <th className="p-3 text-md font-bold text-center">City</th>
              <th className="p-3 text-md font-bold text-center">Governorate</th>
              <th className="p-3 text-md font-bold text-center">
                Contact Phone
              </th>
              <th className="p-3 text-md font-bold text-center">
                Contact Name
              </th>
              <th className="p-3 text-md font-bold text-center">Export file</th>
              <th className="p-3 text-md font-bold text-center">Import file</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className="border cursor-pointer border-gray-600 hover:bg-[#1E293B] transition duration-300"
                >
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {company.id}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {company.name}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {company.address}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {company.city}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {company.governorate}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {company.contactPhone}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    {company.contactName}
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    <button
                      onClick={() => handleExportExcel(company.id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 ml-2"
                    >
                      Export Excel{" "}
                      <CiExport className="inline font-bold ml-2 text-xl" />
                    </button>
                  </td>
                  <td className="p-3 text-sm border border-gray-700 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                    />
                    <button
                      onClick={handleButtonClick}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 ml-2"
                    >
                      Import Excel{" "}
                      <CiImport className="inline font-bold ml-2 text-xl" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-400">
                  No companies found.
                </td>
              </tr>
            )}
            <tr onClick={handleAddCompany} className="hover:bg-[#1E293B]">
              <td
                colSpan="7"
                className="p-4 text-center text-gray-400 "
                style={{ cursor: "pointer" }}
              >
                + Add New Company
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Company Modal */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1E293B] p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-[#FACC15] mb-4">
              Add New Company
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCompany.name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={newCompany.address}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={newCompany.city}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Governorate
                </label>
                <input
                  type="text"
                  name="governorate"
                  value={newCompany.governorate}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={newCompany.contactPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={newCompany.contactName}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-[#0F172A] border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompaniesComponent;
