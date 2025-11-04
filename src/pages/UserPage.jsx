// src/pages/UserPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { updateUser } from "../slices/UserSlice";
import { setUser } from "../slices/AuthSlice";

const formatUserType = (type) => {
  if (!type) return "N/A";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export default function UserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    address: {
      numOfHouse: 0,
      street: "",
      city: "",
      country: "",
      fullAddress: "",
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address
          ? { ...user.address }
          : {
              numOfHouse: 0,
              street: "",
              city: "",
              country: "",
              fullAddress: "",
            },
      });
    }
  }, [user, token, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) return;

    const updatedUserData = {
      ...user,
      ...profile,
      address: {
        ...(user.address || {}),
        ...profile.address,
      },
    };

    const resultAction = await dispatch(
      updateUser({
        id: user.id,
        userData: updatedUserData,
        token: token,
      })
    );

    if (updateUser.fulfilled.match(resultAction)) {
      toast.success("Cập nhật thông tin thành công!");
      dispatch(setUser(resultAction.payload));
      localStorage.setItem("user", JSON.stringify(resultAction.payload));
    } else {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <Header />
        <p className="text-center mt-10 text-gray-700">Đang tải thông tin...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto p-4 py-8 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Tài khoản</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <p className="font-semibold text-gray-900">
                  {user.account?.username}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <p className="font-semibold text-gray-900">
                  {user.account?.role}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Thành viên</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Hạng
                </label>
                <p className="font-semibold text-blue-600">
                  {formatUserType(user.userType)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Điểm tích lũy
                </label>
                <p className="font-semibold text-gray-900">{user.point}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
              Chỉnh sửa thông tin
            </h1>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 text-gray-900">
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-800">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 pt-4 text-gray-900">
                Địa chỉ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Số nhà
                  </label>
                  <input
                    type="number"
                    name="address.numOfHouse"
                    value={profile.address.numOfHouse}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Đường
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={profile.address.street}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={profile.address.city}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Quốc gia
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={profile.address.country}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-800">
                    Địa chỉ đầy đủ (Ghi chú)
                  </label>
                  <input
                    type="text"
                    name="address.fullAddress"
                    value={profile.address.fullAddress}
                    onChange={handleProfileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors mt-6 shadow-sm"
              >
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
