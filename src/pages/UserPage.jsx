// src/pages/UserPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { updateUser } from "../slices/UserSlice";
import { setUser } from "../slices/AuthSlice";
import { selectThemeMode } from "../slices/ThemeSlice";

const formatUserType = (type) => {
  if (!type) return "N/A";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export default function UserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

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

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    if (!token) navigate("/login");
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
      const field = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) return;

    const updatedUserData = {
      ...user,
      ...profile,
      address: { ...(user.address || {}), ...profile.address },
    };

    const resultAction = await dispatch(
      updateUser({ id: user.id, userData: updatedUserData, token })
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
      <div
        className={`${
          isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
        } min-h-screen`}
      >
        <p className="text-center mt-10">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDark
          ? "bg-gray-900 text-gray-200"
          : "bg-gradient-to-b from-white to-gray-50 text-gray-900"
      } min-h-screen transition-colors duration-300`}
    >
      <div className="container mx-auto p-4 py-8 max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="md:col-span-1 space-y-4">
          <div
            className={`p-6 rounded-lg shadow-sm border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Tài khoản</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Username</label>
                <p className="font-semibold">{user.account?.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Vai trò</label>
                <p className="font-semibold">{user.account?.role}</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg shadow-sm border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Thành viên</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Hạng</label>
                <p className="font-semibold text-blue-400">
                  {formatUserType(user.userType)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Điểm tích lũy</label>
                <p className="font-semibold">{user.point}</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg shadow-sm border space-y-2 transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Bảo mật</h2>
            <button
              onClick={() => setShowPasswordConfirm(true)}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Quên mật khẩu
            </button>
            <button
              onClick={() => navigate("/reset-password")}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2">
          <div
            className={`p-6 rounded-lg shadow-sm border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa thông tin</h1>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 pt-4">
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["firstName", "lastName", "dob", "phone", "email"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium">
                        {field === "firstName"
                          ? "Họ"
                          : field === "lastName"
                          ? "Tên"
                          : field === "dob"
                          ? "Ngày sinh"
                          : field === "phone"
                          ? "Số điện thoại"
                          : "Email"}
                      </label>
                      <input
                        type={
                          field === "dob"
                            ? "date"
                            : field === "email"
                            ? "email"
                            : field === "phone"
                            ? "tel"
                            : "text"
                        }
                        name={field}
                        value={profile[field]}
                        onChange={handleProfileChange}
                        className={`w-full mt-1 p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  )
                )}
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 pt-4">
                Địa chỉ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Số nhà",
                    name: "address.numOfHouse",
                    type: "number",
                  },
                  { label: "Đường", name: "address.street", type: "text" },
                  { label: "Thành phố", name: "address.city", type: "text" },
                  { label: "Quốc gia", name: "address.country", type: "text" },
                  {
                    label: "Địa chỉ đầy đủ (Ghi chú)",
                    name: "address.fullAddress",
                    type: "text",
                    full: true,
                  },
                ].map((addr) => (
                  <div
                    key={addr.name}
                    className={addr.full ? "sm:col-span-2" : ""}
                  >
                    <label className="block text-sm font-medium">
                      {addr.label}
                    </label>
                    <input
                      type={addr.type}
                      name={addr.name}
                      value={
                        addr.name.includes("address")
                          ? profile.address[addr.name.split(".")[1]]
                          : profile[addr.name]
                      }
                      onChange={handleProfileChange}
                      className={`w-full mt-1 p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 mt-6 shadow-sm ${
                  isDark
                    ? "bg-cyan-600 text-white hover:bg-cyan-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      </div>

      {showPasswordConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg w-96 transition-colors duration-300 ${
              isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Xác nhận quên mật khẩu</h2>
            <p className="mb-4">
              Bạn có chắc đã quên mật khẩu? Sau khi xác nhận, bạn sẽ được chuyển
              đến trang quên mật khẩu.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => navigate("/forgot-password")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
