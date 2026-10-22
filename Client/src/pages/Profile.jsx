import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Calendar,
  Shield,
  Camera,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  // State for the user data displayed on screen
  const [profileData, setProfileData] = useState({
    username: "",
    role: "",
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    avatar: "",
    address: {
      country: "",
      city: "",
      state: "",
      zipCode: "",
      street: "",
    },
  });

  // State for Edit Mode
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempData, setTempData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setProfileData({
      username: user.username || "",
      role: user.role || "Customer",
      email: user.email || "",
      firstName: user.profile?.firstName || "",
      lastName: user.profile?.lastName || "",
      dateOfBirth: user.profile?.dateOfBirth || "",
      phone: user.profile?.phone || "",
      avatar: user.profile?.avatar || "",
      address: {
        country: user.profile?.address?.country || "",
        city: user.profile?.address?.city || "",
        state: user.profile?.address?.state || "",
        zipCode: user.profile?.address?.zipCode || "",
        street: user.profile?.address?.street || "",
      },
    });
  }, [user, navigate]);

  const handleEditClick = (section) => {
    setTempData(JSON.parse(JSON.stringify(profileData))); // Deep copy
    if (section === "info") setIsEditingInfo(true);
    if (section === "address") setIsEditingAddress(true);
  };

  const handleCancel = () => {
    setIsEditingInfo(false);
    setIsEditingAddress(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setTempData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setTempData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (section) => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: tempData.username,
          profile: {
            firstName: tempData.firstName,
            lastName: tempData.lastName,
            dateOfBirth: tempData.dateOfBirth,
            phone: tempData.phone,
            avatar: tempData.avatar,
            address: tempData.address,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProfileData(tempData);

        // ✅ USE THE NEW FUNCTION HERE
        updateUser(data.user);

        if (section === "info") setIsEditingInfo(false);
        if (section === "address") setIsEditingAddress(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    }
    return profileData.username ? profileData.username[0].toUpperCase() : "U";
  };

  return (
    <>
      <Header />
      <main className="bg-[#f4f7f6] min-h-screen py-10">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-medium text-gray-700 mb-6">My Profile</h1>

          {/* Top Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 flex items-center gap-6">
            <div className="relative">
              {profileData.avatar ? (
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#f0dfc8] flex items-center justify-center text-3xl font-bold text-[#8b6b4a] border-4 border-gray-50">
                  {getInitials()}
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-[#3b82f6] text-white p-1.5 rounded-full border-2 border-white shadow-sm hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.firstName || profileData.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : profileData.username}
              </h2>
              <p className="text-gray-500 font-medium capitalize">
                {profileData.role}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {profileData.address.city
                  ? `${profileData.address.city}, `
                  : ""}
                {profileData.address.country}
              </p>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-[#1a2d5e]">
                Personal Information
              </h3>
              {!isEditingInfo && (
                <button
                  onClick={() => handleEditClick("info")}
                  className="flex items-center gap-2 bg-[#DA4C2F] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#c43d22] transition-colors"
                >
                  Edit <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
              {/* First Name */}
              <div>
                <p className="text-sm text-gray-400 mb-1">First Name</p>
                {isEditingInfo ? (
                  <input
                    type="text"
                    name="firstName"
                    value={tempData.firstName}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-[#DA4C2F] outline-none py-1 text-gray-800"
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {profileData.firstName || "-"}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Last Name</p>
                {isEditingInfo ? (
                  <input
                    type="text"
                    name="lastName"
                    value={tempData.lastName}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-[#DA4C2F] outline-none py-1 text-gray-800"
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {profileData.lastName || "-"}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Date of Birth</p>
                {isEditingInfo ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={tempData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-[#DA4C2F] outline-none py-1 text-gray-800"
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {profileData.dateOfBirth || "-"}
                  </p>
                )}
              </div>

              {/* Email (Not editable usually, but you can allow it) */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Email Address</p>
                <p className="font-medium text-gray-800">{profileData.email}</p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                {isEditingInfo ? (
                  <input
                    type="text"
                    name="phone"
                    value={tempData.phone}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-[#DA4C2F] outline-none py-1 text-gray-800"
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {profileData.phone || "-"}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <p className="text-sm text-gray-400 mb-1">User Role</p>
                <p className="font-medium text-gray-800 capitalize">
                  {profileData.role}
                </p>
              </div>
            </div>

            {isEditingInfo && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("info")}
                  disabled={isSaving}
                  className="px-6 py-2 text-sm font-medium text-white bg-[#DA4C2F] rounded-lg hover:bg-[#c43d22] transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-[#1a2d5e]">Address</h3>
              {!isEditingAddress && (
                <button
                  onClick={() => handleEditClick("address")}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Edit <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
              {/* Country */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Country</p>
                {isEditingAddress ? (
                  <input
                    type="text"
                    name="address.country"
                    value={tempData.address.country}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-[#DA4C2F] outline-none py-1 text-gray-800"
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {profileData.address.country || "-"}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <p className="text-sm text-gray-400 mb-1">City</p>
                {isEditingAddress ? (
                  <input
                    type="text"
                    name="address.city"
                    value={tempData.address.city}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-[#DA4C2F] outline-none py-1 text-gray-800"
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {profileData.address.city || "-"}
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Postal Code</p>
                {isEditingAddress ? (
                  <input
                    type="text"
                    name="address.zipCode"
                    value={tempData.address.zipCode}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 focus:border-[#DA4C2F] outline-none py-1 text-gray-800"
                  />
                ) : (
                  <p className="font-medium text-gray-800">
                    {profileData.address.zipCode || "-"}
                  </p>
                )}
              </div>
            </div>

            {isEditingAddress && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("address")}
                  disabled={isSaving}
                  className="px-6 py-2 text-sm font-medium text-white bg-[#DA4C2F] rounded-lg hover:bg-[#c43d22] transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
