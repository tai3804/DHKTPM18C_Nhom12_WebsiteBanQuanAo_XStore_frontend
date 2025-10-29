// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../slices/AuthSlice";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //so sánh xem confirm password có đúng không
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // call api tạo user và account mới
    try {
      const res = await dispatch(
        registerUser({
          firstName: form.firstName,
          lastName: form.lastName,
          dob: form.dob || null,
          username: form.username,
          password: form.password,
          email: form.email || null,
        })
      );

      //xoá null cho form
      if (res.payload && res.payload.code === 200) {
        setForm({
          firstName: "",
          lastName: "",
          dob: "",
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
        });
      } else {
        setError(res.payload?.message || "Register failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng ký</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
