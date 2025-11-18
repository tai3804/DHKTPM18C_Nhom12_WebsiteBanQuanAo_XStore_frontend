import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { registerUser } from "../slices/AuthSlice";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function RegisterInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);

  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Lấy contact từ VerifyOtpPage
  useEffect(() => {
    if (location.state) {
      setContact(location.state.contact);
      setContactType(location.state.contactType);
    } else {
      // Nếu không có state, chuyển hướng lại SendOtpPage
      navigate("/send-otp");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.firstName.trim()) {
      setError("Vui lòng nhập tên!");
      return;
    }
    if (!form.lastName.trim()) {
      setError("Vui lòng nhập họ!");
      return;
    }
    if (!form.dob) {
      setError("Vui lòng chọn ngày sinh!");
      return;
    }
    if (!form.username.trim()) {
      setError("Vui lòng nhập tên đăng nhập!");
      return;
    }
    if (!form.password) {
      setError("Vui lòng nhập mật khẩu!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không trùng khớp!");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);

    try {
      // Tạo tài khoản
      const res = await dispatch(
        registerUser({
          firstName: form.firstName,
          lastName: form.lastName,
          dob: form.dob,
          username: form.username,
          password: form.password,
          email: contactType === "email" ? contact : null,
          phone: contactType === "phone" ? contact : null,
        })
      ).unwrap();

      if (res.code === 200) {
        setForm({
          firstName: "",
          lastName: "",
          dob: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(res.message || "Đăng ký tài khoản thất bại");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen py-8 transition-colors duration-300 ${
        themeMode === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg w-full max-w-md transition-colors duration-300 ${
          themeMode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
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
            Nhập thông tin tài khoản
          </h1>
        </div>
        <p
          className={`text-center text-sm mb-6 transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Xác thực: {contactType === "email" ? "📧" : "📱"} {contact}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="Tên"
            value={form.firstName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Họ"
            value={form.lastName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            required
          />

          {error && (
            <div
              className={`p-3 border rounded-lg text-sm transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-red-900 border-red-700 text-red-200"
                  : "bg-red-100 border-red-400 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              themeMode === "dark"
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <button
            onClick={() => navigate("/send-otp")}
            className={`transition-colors duration-300 hover:underline ${
              themeMode === "dark"
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
