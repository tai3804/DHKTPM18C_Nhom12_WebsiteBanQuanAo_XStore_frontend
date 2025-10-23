import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { getUserByUsername } from "../slices/UserSlice";
import { loginUser, setUser, setToken } from "../slices/AuthSlice";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await dispatch(loginUser({ username, password }));

    if (res.payload && res.payload.code === 200) {
      const token = res.payload.result;
      dispatch(setToken(token));

      const decoded = jwtDecode(token);
      const usernameFromToken = decoded.sub;

      const userRes = await dispatch(getUserByUsername(usernameFromToken));
      const user = userRes.payload.result;
      dispatch(setUser(user));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Token:", token);
      console.log("User:", user);

      navigate("/");
    } else {
      console.log(res.payload?.message || "Login failed");
    }
  } catch (err) {
    console.log("Error login:", err.message);
  }
};

return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>

        {/* Form login */}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        {/* Links tạo tài khoản và quên mật khẩu */}
        <div className="mt-4 flex justify-between text-sm">
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Tạo tài khoản
          </Link>

          <Link
            to="/reset-password"
            className="text-blue-500 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}