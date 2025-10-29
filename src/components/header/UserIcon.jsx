// src/components/UserIcon.jsx
import { useState, useRef, useEffect } from "react";
import { CircleUser } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser, clearToken } from "../../slices/AuthSlice";

export default function UserIcon() {
  const [open, setOpen] = useState(false);
  const users = useSelector((state) => state.auth.user);
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
          className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer"
        >
          <CircleUser className="h-6 w-6" />
        </button>
      ) : (
        <button
          onClick={() => handleNavigate("/login")}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Login
        </button>
      )}

      {/* Logic hiển thị dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <>
            <button
              onClick={() => handleNavigate("/user")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Info
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
            >
              Logout
            </button>
          </>
        </div>
      )}
    </div>
  );
}
