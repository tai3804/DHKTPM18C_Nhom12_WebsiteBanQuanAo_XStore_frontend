import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../slices/AuthSlice";
import { toast } from "react-toastify";

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Xác thực OTP</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-2xl tracking-widest"
              disabled={timeLeft <= 0}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Thời gian hết hạn:{" "}
              <span className="text-red-500 font-bold">
                {formatTime(timeLeft)}
              </span>
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || timeLeft <= 0}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xác thực..." : "Xác thực"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Không nhận được mã?</p>
          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="text-blue-500 hover:underline text-sm font-semibold disabled:opacity-50"
          >
            Gửi lại OTP
          </button>
        </div>

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
