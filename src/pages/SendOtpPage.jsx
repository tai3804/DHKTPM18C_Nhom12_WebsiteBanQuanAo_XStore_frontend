import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { selectThemeMode } from "../slices/ThemeSlice";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";

function SendOtpPage() {
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);

  const [contactType, setContactType] = useState("email"); // email hoặc phone
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateContact = () => {
    if (!contact) {
      setError(
        `Vui lòng nhập ${contactType === "email" ? "email" : "số điện thoại"}!`
      );
      return false;
    }

    if (contactType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) {
        setError("Email không hợp lệ!");
        return false;
      }
    } else if (contactType === "phone") {
      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(contact)) {
        setError("Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số!");
        return false;
      }
    }

    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateContact()) return;

    setLoading(true);

    try {
      // Gọi API gửi OTP
      const endpoint =
        contactType === "email"
          ? "/api/otp/register"
          : "/api/otp/register-phone";

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      const data = await res.json();

      if (res.ok && data.code === 200) {
        toast.success(`Mã OTP đã được gửi đến ${contact}!`);

        // Chuyển hướng đến trang xác thực OTP
        navigate("/verify-otp", {
          state: {
            contact: contact,
            contactType: contactType,
          },
        });
      } else {
        setError(data.message || "Gửi OTP thất bại!");
      }
    } catch (err) {
      setError("Không thể gửi OTP, vui lòng thử lại sau!");
      console.error(err);
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
            Tạo tài khoản
          </h1>
        </div>
        <p
          className={`text-sm text-center mb-6 transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Nhập email hoặc số điện thoại để bắt đầu
        </p>

        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          {/* Chọn loại xác thực */}
          <div
            className={`p-4 rounded-lg transition-colors duration-300 ${
              themeMode === "dark" ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <p
              className={`text-sm font-semibold mb-3 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Chọn cách xác thực:
            </p>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="contactType"
                  value="email"
                  checked={contactType === "email"}
                  onChange={(e) => {
                    setContactType(e.target.value);
                    setContact("");
                    setError("");
                  }}
                  className="w-4 h-4 text-blue-500"
                />
                <span
                  className={`ml-2 text-sm transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="contactType"
                  value="phone"
                  checked={contactType === "phone"}
                  onChange={(e) => {
                    setContactType(e.target.value);
                    setContact("");
                    setError("");
                  }}
                  className="w-4 h-4 text-blue-500"
                />
                <span
                  className={`ml-2 text-sm transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Số điện thoại
                </span>
              </label>
            </div>
          </div>

          {/* Nhập thông tin xác thực */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {contactType === "email" ? "Email" : "Số điện thoại"}
            </label>
            <input
              type={contactType === "email" ? "email" : "tel"}
              placeholder={
                contactType === "email"
                  ? "Nhập email của bạn"
                  : "Nhập số điện thoại (0xxxxxxxxx)"
              }
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setError("");
              }}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

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
            {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <p
            className={`transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className={`font-semibold hover:underline transition-colors duration-300 ${
                themeMode === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SendOtpPage;
