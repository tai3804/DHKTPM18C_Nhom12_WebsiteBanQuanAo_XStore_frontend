import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function SendOtpPage() {
  const navigate = useNavigate();

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

      const res = await fetch(endpoint, {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Tạo tài khoản</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Nhập email hoặc số điện thoại để bắt đầu
        </p>

        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          {/* Chọn loại xác thực */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-3 text-gray-700">
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
                <span className="ml-2 text-sm">Email</span>
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
                <span className="ml-2 text-sm">Số điện thoại</span>
              </label>
            </div>
          </div>

          {/* Nhập thông tin xác thực */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
            {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline font-semibold"
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
