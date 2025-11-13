import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { getUserByUsername } from "../slices/UserSlice";
import { loginUser, setUser, setToken } from "../slices/AuthSlice";
import { selectThemeMode } from "../slices/ThemeSlice";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ username, password }));
    if (res.payload.code == 200) navigate("/");
  };

  return (
    <div
      className={`flex items-center justify-center h-screen transition-colors duration-300 ${
        themeMode === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg w-full max-w-sm transition-colors duration-300 ${
          themeMode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className={`transition-colors duration-300 cursor-pointer ${
              themeMode === "dark"
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Đăng nhập
          </h1>
        </div>

        {/* Form login */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />

          <button
            type="submit"
            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Login
          </button>
        </form>

        {/* Links tạo tài khoản và quên mật khẩu */}
        <div className="mt-4 flex justify-between text-sm">
          <Link
            to="/send-otp"
            className={`transition-colors duration-300 hover:underline ${
              themeMode === "dark" ? "text-blue-400" : "text-blue-500"
            }`}
          >
            Tạo tài khoản
          </Link>

          <Link
            to="/forgot-password"
            className={`transition-colors duration-300 hover:underline ${
              themeMode === "dark" ? "text-blue-400" : "text-blue-500"
            }`}
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}
