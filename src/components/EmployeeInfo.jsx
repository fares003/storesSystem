import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API;

function EmployeeInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    salary: "",
    store: "",
    roles: [],
  });
  const [updateFields, setUpdateFields] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    salary: false,
    store: false,
    roles: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}Auth/read-employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setEmployee(response.data);
          setFormData({
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber || "",
            salary: response.data.salary,
            store: response.data.store,
            roles: response.data.roles || [],
          });
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      let newRoles = [...prev.roles];
      if (checked) {
        newRoles.push(value);
      } else {
        newRoles = newRoles.filter(role => role !== value);
      }
      return { ...prev, roles: newRoles };
    });
  };

  const toggleFieldUpdate = (field) => {
    setUpdateFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Prepare payload with only the fields marked for update plus the ID
    const payload = { id }; // Include ID in the body
    Object.keys(updateFields).forEach(field => {
      if (updateFields[field]) {
        payload[field] = formData[field];
      }
    });
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API}Auth/update-employee`, // Removed /${id} from URL
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/employees");
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update employee");
    } finally {
      setIsLoading(false);
    }
  };

  if (!employee) return <div className="text-center text-white">Loading...</div>;

  const availableRoles = ["Admin", "Manager", "Cashier", "Stock Clerk"];

  return (
    <div className="text-white p-5 bg-[#1E293B] rounded-md m-5 shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-center text-[#FACC15] mb-6">
        Update Employee Information
      </h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-700 text-white rounded-md text-center">
          Employee updated successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-700 text-white rounded-md text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Full Name
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 bg-[#0F172A] border ${updateFields.name ? 'border-[#FACC15]' : 'border-gray-700'} rounded-md`}
                disabled={!updateFields.name}
              />
              <button
                type="button"
                onClick={() => toggleFieldUpdate('name')}
                className={`ml-2 px-3 py-1 rounded-md ${updateFields.name ? 'bg-[#FACC15] text-[#1E293B]' : 'bg-gray-600 text-white'}`}
              >
                {updateFields.name ? 'Updating' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <div className="flex items-center">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 bg-[#0F172A] border ${updateFields.email ? 'border-[#FACC15]' : 'border-gray-700'} rounded-md`}
                disabled={!updateFields.email}
              />
              <button
                type="button"
                onClick={() => toggleFieldUpdate('email')}
                className={`ml-2 px-3 py-1 rounded-md ${updateFields.email ? 'bg-[#FACC15] text-[#1E293B]' : 'bg-gray-600 text-white'}`}
              >
                {updateFields.email ? 'Updating' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1" htmlFor="phoneNumber">
              Phone Number
            </label>
            <div className="flex items-center">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full p-2 bg-[#0F172A] border ${updateFields.phoneNumber ? 'border-[#FACC15]' : 'border-gray-700'} rounded-md`}
                disabled={!updateFields.phoneNumber}
              />
              <button
                type="button"
                onClick={() => toggleFieldUpdate('phoneNumber')}
                className={`ml-2 px-3 py-1 rounded-md ${updateFields.phoneNumber ? 'bg-[#FACC15] text-[#1E293B]' : 'bg-gray-600 text-white'}`}
              >
                {updateFields.phoneNumber ? 'Updating' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Salary */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1" htmlFor="salary">
              Salary 
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={`w-full p-2 bg-[#0F172A] border ${updateFields.salary ? 'border-[#FACC15]' : 'border-gray-700'} rounded-md`}
                disabled={!updateFields.salary}
              />
              <button
                type="button"
                onClick={() => toggleFieldUpdate('salary')}
                className={`ml-2 px-3 py-1 rounded-md ${updateFields.salary ? 'bg-[#FACC15] text-[#1E293B]' : 'bg-gray-600 text-white'}`}
              >
                {updateFields.salary ? 'Updating' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Store */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1" htmlFor="store">
              Store
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="store"
                name="store"
                value={formData.store}
                onChange={handleChange}
                className={`w-full p-2 bg-[#0F172A] border ${updateFields.store ? 'border-[#FACC15]' : 'border-gray-700'} rounded-md`}
                disabled={!updateFields.store}
              />
              <button
                type="button"
                onClick={() => toggleFieldUpdate('store')}
                className={`ml-2 px-3 py-1 rounded-md ${updateFields.store ? 'bg-[#FACC15] text-[#1E293B]' : 'bg-gray-600 text-white'}`}
              >
                {updateFields.store ? 'Updating' : 'Edit'}
              </button>
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Roles</label>
            <button
              type="button"
              onClick={() => toggleFieldUpdate('roles')}
              className={`px-3 py-1 rounded-md ${updateFields.roles ? 'bg-[#FACC15] text-[#1E293B]' : 'bg-gray-600 text-white'}`}
            >
              {updateFields.roles ? 'Updating Roles' : 'Edit Roles'}
            </button>
          </div>
          {updateFields.roles ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-[#0F172A] rounded-md border border-[#FACC15]">
              {availableRoles.map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`role-${role}`}
                    value={role}
                    checked={formData.roles.includes(role)}
                    onChange={handleRoleChange}
                    className="h-4 w-4 text-[#FACC15] focus:ring-[#FACC15] border-gray-700 rounded bg-[#0F172A]"
                  />
                  <label htmlFor={`role-${role}`} className="ml-2 text-sm">
                    {role}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-[#0F172A] rounded-md border border-gray-700">
              {formData.roles.length > 0 ? formData.roles.join(", ") : "No roles assigned"}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !Object.values(updateFields).some(f => f)}
            className={`px-4 py-2 rounded-md transition font-medium ${
              isLoading || !Object.values(updateFields).some(f => f)
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-[#FACC15] text-[#1E293B] hover:bg-yellow-500'
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Selected Fields'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeInfo;