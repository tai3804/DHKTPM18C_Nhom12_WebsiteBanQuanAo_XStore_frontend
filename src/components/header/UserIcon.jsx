// src/components/UserIcon.jsx
import { useState, useRef, useEffect } from "react";
import { CircleUser } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser, clearToken } from "../../slices/AuthSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function UserIcon() {
  const [open, setOpen] = useState(false);
  const users = useSelector((state) => state.auth.user);
  const themeMode = useSelector(selectThemeMode);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy token từ Redux store
  const { token } = useSelector((state) => state.auth);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/login");
    dispatch(clearUser());
    dispatch(clearToken());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setOpen(false); // Đóng dropdown
  };

  // Hàm điều hướng và đóng menu
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {users != null ? (
        <button
          onClick={() => setOpen(!open)}
          className={`flex justify-center items-center p-2 rounded-full transition-all duration-200 cursor-pointer ${
            themeMode === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
        >
          <CircleUser
            className={`h-6 w-6 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          />
        </button>
      ) : (
        <button
          onClick={() => handleNavigate("/login")}
          className={`p-2 text-sm font-medium rounded-lg transition-colors duration-300 cursor-pointer ${
            themeMode === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Đăng nhập
        </button>
      )}

      {/* Logic hiển thị dropdown */}
      {open && (
        <div
          className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 transition-colors ${
            themeMode === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <>
            <button
              onClick={() => handleNavigate("/user")}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer first:rounded-t-lg ${
                themeMode === "dark"
                  ? "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              Thông tin
            </button>

            {/* Nút đổi mật khẩu */}
            <button
              onClick={() => handleNavigate("/reset-password")}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Đổi mật khẩu
            </button>

            <button
              onClick={handleLogout}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer last:rounded-b-lg border-t ${
                themeMode === "dark"
                  ? "text-red-400 hover:bg-gray-700 border-gray-700"
                  : "text-red-600 hover:bg-red-50 border-gray-100"
              }`}
            >
              Đăng xuất
            </button>
          </>
        </div>
      )}
    </div>
  );
}
