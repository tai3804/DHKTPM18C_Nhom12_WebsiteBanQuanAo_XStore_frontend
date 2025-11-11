import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../slices/AuthSlice";
import { toast } from "react-toastify";

export default function RegisterInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        // Toast đã được handle trong Redux slice, không cần duplicate
        // toast.success("Đăng ký tài khoản thành công!");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Nhập thông tin tài khoản
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Xác thực: {contactType === "email" ? "📧" : "📱"} {contact}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="Tên"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Họ"
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
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <button
            onClick={() => navigate("/send-otp")}
            className="text-gray-500 hover:underline"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
