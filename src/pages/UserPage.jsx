// src/pages/UserPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { updateUser } from "../slices/UserSlice";
import { setUser } from "../slices/AuthSlice";
import { selectThemeMode } from "../slices/ThemeSlice";
import { API_BASE_URL } from "../config/api";

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
    avatar: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
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
        avatar: user.avatar || "",
      });
    }
  }, [user, token, navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File quá lớn! Kích thước tối đa là 10MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)");
      return;
    }

    setSelectedFile(file);

    // Tự động upload ngay khi chọn file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatar");

    try {
      toast.info("Đang tải lên avatar...");
      const response = await fetch(`${API_BASE_URL}/api/file/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.code === 200) {
        // Backend trả về path tương đối: "/avatars/filename.jpg"
        const avatarPath = data.result;

        // Lưu URL đầy đủ vào profile state
        const avatarUrl = `${API_BASE_URL}${avatarPath}`;
        setProfile((prev) => ({ ...prev, avatar: avatarUrl }));

        // ✅ Gọi API updateUser để lưu avatar vào database
        const updatedUserData = {
          ...user,
          avatar: avatarUrl, // Lưu URL đầy đủ
        };

        const resultAction = await dispatch(
          updateUser({ id: user.id, userData: updatedUserData, token })
        );

        if (updateUser.fulfilled.match(resultAction)) {
          // Cập nhật Redux store và localStorage
          const savedUser = { ...resultAction.payload, avatar: avatarUrl };
          dispatch(setUser(savedUser));
          localStorage.setItem("user", JSON.stringify(savedUser));

          toast.success("Upload và lưu avatar thành công!");
        } else {
          toast.error("Upload thành công nhưng lưu vào database thất bại!");
        }

        setSelectedFile(null);
      } else {
        toast.error(data.message || "Upload thất bại!");
      }
    } catch (error) {
      console.error("Upload avatar error:", error);
      toast.error("Lỗi khi upload avatar!");
    }
  };

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
      avatar: profile.avatar, // Đảm bảo avatar được lưu
    };

    const resultAction = await dispatch(
      updateUser({ id: user.id, userData: updatedUserData, token })
    );

    if (updateUser.fulfilled.match(resultAction)) {
      toast.success("Cập nhật thông tin thành công!");
      const updatedUser = { ...resultAction.payload, avatar: profile.avatar };
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
            <h2 className="text-xl font-bold mb-4">Avatar</h2>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={
                  profile.avatar
                    ? profile.avatar.startsWith("http")
                      ? profile.avatar
                      : `${API_BASE_URL}${profile.avatar}`
                    : "https://via.placeholder.com/150"
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avatar của bạn
              </p>
              <div className="w-full">
                <label className="relative cursor-pointer group block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-300 text-center ${
                      isDark
                        ? "bg-gray-700 border-gray-600 hover:border-blue-500 hover:bg-gray-650 group-hover:shadow-lg"
                        : "bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50 group-hover:shadow-lg"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg
                        className={`w-8 h-8 ${
                          isDark ? "text-blue-400" : "text-blue-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <div>
                        <span
                          className={`text-sm font-semibold block ${
                            isDark ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          Nhấn để chọn ảnh avatar
                        </span>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Avatar sẽ tự động cập nhật khi bạn chọn ảnh
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
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
            <div className="space-y-4">
              {/* Hạng thành viên với icon */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Hạng hiện tại
                </label>
                <div className="flex items-center gap-2">
                  {user.userType === "PLATINUM" && (
                    <span className="text-2xl">💎</span>
                  )}
                  {user.userType === "GOLD" && (
                    <span className="text-2xl">🥇</span>
                  )}
                  {user.userType === "SILVER" && (
                    <span className="text-2xl">🥈</span>
                  )}
                  {user.userType === "COPPER" && (
                    <span className="text-2xl">🥉</span>
                  )}
                  <span
                    className={`font-bold text-lg ${
                      user.userType === "PLATINUM"
                        ? "text-purple-400"
                        : user.userType === "GOLD"
                        ? "text-yellow-400"
                        : user.userType === "SILVER"
                        ? "text-gray-300"
                        : "text-orange-400"
                    }`}
                  >
                    {user.userType === "PLATINUM"
                      ? "Bạch Kim"
                      : user.userType === "GOLD"
                      ? "Vàng"
                      : user.userType === "SILVER"
                      ? "Bạc"
                      : "Đồng"}
                  </span>
                </div>
              </div>

              {/* Điểm tích lũy */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Điểm tích lũy
                </label>
                <p className="font-bold text-2xl text-emerald-500">
                  {user.point || 0} điểm
                </p>
              </div>

              {/* Progress bar nếu chưa đạt Platinum */}
              {user.userType !== "PLATINUM" && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Tiến trình lên hạng</span>
                    <span>
                      {user.userType === "GOLD"
                        ? `${user.point}/500`
                        : user.userType === "SILVER"
                        ? `${user.point}/200`
                        : `${user.point}/100`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        user.userType === "GOLD"
                          ? "bg-purple-500"
                          : user.userType === "SILVER"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                      style={{
                        width: `${
                          user.userType === "GOLD"
                            ? (user.point / 500) * 100
                            : user.userType === "SILVER"
                            ? (user.point / 200) * 100
                            : (user.point / 100) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                    {user.userType === "GOLD"
                      ? `Còn ${500 - user.point} điểm để lên Bạch Kim`
                      : user.userType === "SILVER"
                      ? `Còn ${200 - user.point} điểm để lên Vàng`
                      : `Còn ${100 - user.point} điểm để lên Bạc`}
                  </p>
                </div>
              )}

              {user.userType === "PLATINUM" && (
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    🎉 Chúc mừng! Bạn đã đạt hạng cao nhất
                  </p>
                </div>
              )}

              {/* Thông tin tích điểm */}
              <div className="border-t pt-3 mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 Mỗi 1.000₫ = 1 điểm
                  <br />
                  🥉 Đồng: 0-99 điểm
                  <br />
                  🥈 Bạc: 100-199 điểm
                  <br />
                  🥇 Vàng: 200-499 điểm
                  <br />
                  💎 Bạch Kim: ≥500 điểm
                </p>
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
