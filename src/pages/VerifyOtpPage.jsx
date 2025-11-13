import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { verifyOtp } from "../slices/AuthSlice";
import { selectThemeMode } from "../slices/ThemeSlice";
import { toast } from "react-toastify";

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [contactInfo, setContactInfo] = useState("");
  const [contactType, setContactType] = useState("");

  // Lấy dữ liệu từ SendOtpPage
  useEffect(() => {
    if (location.state) {
      setContactInfo(location.state.contact);
      setContactType(location.state.contactType);
    } else {
      // Nếu không có state, chuyển hướng lại SendOtpPage
      navigate("/send-otp");
    }
  }, [location, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setError("Mã OTP đã hết hạn. Vui lòng gửi lại.");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Vui lòng nhập mã OTP!");
      return;
    }

    if (otp.length !== 6) {
      setError("Mã OTP phải có 6 chữ số!");
      return;
    }

    if (timeLeft <= 0) {
      setError("Mã OTP đã hết hạn!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Xác thực OTP
      const verifyRes = await dispatch(
        verifyOtp({ contact: contactInfo, otp })
      ).unwrap();

      if (verifyRes.code === 200) {
        // Toast đã được handle trong Redux slice, không cần duplicate
        // toast.success("Xác thực OTP thành công!");

        // Chuyển hướng tới trang nhập thông tin đăng ký
        navigate("/register-info", {
          state: {
            contact: contactInfo,
            contactType: contactType,
          },
        });
      } else {
        setError(verifyRes.message || "Xác thực OTP thất bại");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    // Gửi lại OTP
    setTimeLeft(300);
    setOtp("");
    setError("");
    navigate("/send-otp");
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
            Xác thực OTP
          </h1>
        </div>
        <p
          className={`text-center text-sm mb-6 transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Mã xác thực đã được gửi đến: <br />
          <span className="font-semibold">{contactInfo}</span>
        </p>

        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Nhập 6 chữ số mã OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
                setError("");
              }}
              maxLength="6"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-2xl tracking-widest transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              disabled={timeLeft <= 0}
            />
            <p
              className={`text-xs mt-2 text-center transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Thời gian hết hạn:{" "}
              <span
                className={`font-bold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-red-400" : "text-red-500"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </p>
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
            disabled={loading || timeLeft <= 0}
            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              themeMode === "dark"
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Đang xác thực..." : "Xác thực"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p
            className={`text-sm mb-2 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Không nhận được mã?
          </p>
          <button
            onClick={handleResendOtp}
            disabled={loading}
            className={`text-sm font-semibold disabled:opacity-50 transition-colors duration-300 hover:underline ${
              themeMode === "dark" ? "text-blue-400" : "text-blue-500"
            }`}
          >
            Gửi lại OTP
          </button>
        </div>

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
