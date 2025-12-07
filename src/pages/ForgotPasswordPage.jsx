// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  sendResetPasswordOtp,
  verifyOtp,
  resetPassword,
} from "../slices/AuthSlice";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { selectThemeMode } from "../slices/ThemeSlice";
import { Mail, ShieldCheck, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  // Step management: 1 = Email, 2 = OTP, 3 = Password
  const [step, setStep] = useState(user?.email ? 2 : 1);
  const [contactInfo, setContactInfo] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- GỬI OTP TỰ ĐỘNG KHI ĐÃ ĐĂNG NHẬP ---
  useEffect(() => {
    const sendInitialOtp = async () => {
      if (user?.email && step === 2) {
        setIsLoading(true);
        const result = await dispatch(sendResetPasswordOtp(user.email));
        setIsLoading(false);

        if (result.type.endsWith("fulfilled")) {
          toast.success(`Mã OTP đã được gửi đến: ${user.email}`);
        } else {
          toast.error("Không thể gửi OTP. Vui lòng thử lại sau.");
        }
      }
    };

    sendInitialOtp();
  }, [dispatch, user, step]);

  // --- BƯỚC 1: GỬI OTP ĐẾN EMAIL ---
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!contactInfo) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    setIsLoading(true);
    const result = await dispatch(sendResetPasswordOtp(contactInfo));
    setIsLoading(false);

    if (result.type.endsWith("fulfilled")) {
      toast.success(`Mã OTP đã được gửi đến: ${contactInfo}`);
      setStep(2); // Chuyển sang bước nhập OTP
    } else {
      toast.error("Không thể gửi OTP. Vui lòng kiểm tra email và thử lại.");
    }
  };

  // --- BƯỚC 2: XÁC THỰC OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Vui lòng nhập mã OTP!");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Mã OTP phải có 6 ký tự!");
      return;
    }

    setIsLoading(true);
    const verifyAction = await dispatch(
      verifyOtp({ contact: contactInfo, otp })
    );
    setIsLoading(false);

    if (verifyOtp.fulfilled.match(verifyAction)) {
      toast.success("Xác thực OTP thành công!");
      setStep(3); // Chuyển sang bước đổi mật khẩu
    } else {
      toast.error("OTP không hợp lệ hoặc đã hết hạn!");
    }
  };

  // --- BƯỚC 3: ĐẶT LẠI MẬT KHẨU ---
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không trùng khớp!");
      return;
    }

    setIsLoading(true);
    const resetAction = await dispatch(
      resetPassword({ username: contactInfo, newPassword })
    );
    setIsLoading(false);

    if (resetPassword.fulfilled.match(resetAction)) {
      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } else {
      toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  // --- GỬI LẠI OTP ---
  const handleResendOtp = async () => {
    if (!contactInfo) {
      toast.error("Vui lòng nhập email trước khi gửi lại OTP!");
      return;
    }

    setIsLoading(true);
    const result = await dispatch(sendResetPasswordOtp(contactInfo));
    setIsLoading(false);

    if (result.type.endsWith("fulfilled")) {
      toast.success(`Mã OTP mới đã được gửi đến: ${contactInfo}`);
      setOtp(""); // Reset OTP input
    } else {
      toast.error("Không thể gửi lại OTP. Vui lòng thử lại.");
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Email", icon: Mail },
      { number: 2, label: "Xác thực OTP", icon: ShieldCheck },
      { number: 3, label: "Mật khẩu mới", icon: Lock },
    ];

    // Nếu user đã đăng nhập, bỏ qua bước 1
    const displaySteps = user?.email ? steps.slice(1) : steps;

    return (
      <div className="flex items-center justify-center mb-8">
        {displaySteps.map((s, index) => {
          const StepIcon = s.icon;
          const isActive = s.number === step;
          const isCompleted = s.number < step;
          const adjustedNumber = user?.email ? s.number - 1 : s.number;

          return (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? isDark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isCompleted
                      ? isDark
                        ? "bg-green-600 text-white"
                        : "bg-green-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <StepIcon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs mt-2 ${
                    isActive
                      ? isDark
                        ? "text-blue-400 font-semibold"
                        : "text-blue-600 font-semibold"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {index < displaySteps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    s.number < step
                      ? isDark
                        ? "bg-green-600"
                        : "bg-green-500"
                      : isDark
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div
          className={`w-full max-w-md p-8 rounded-lg shadow-lg border transition-all duration-300 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-3xl font-bold text-center mb-2 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Quên Mật Khẩu
          </h2>
          <p
            className={`text-center text-sm mb-6 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {step === 1 && "Nhập email của bạn để nhận mã OTP"}
            {step === 2 && "Nhập mã OTP đã được gửi đến email của bạn"}
            {step === 3 && "Tạo mật khẩu mới cho tài khoản của bạn"}
          </p>

          {renderStepIndicator()}

          {/* BƯỚC 1: NHẬP EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  isDark
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`w-full text-center text-sm mt-2 transition-colors duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Quay lại đăng nhập
              </button>
            </form>
          )}

          {/* BƯỚC 2: XÁC THỰC OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={contactInfo}
                  disabled
                  className={`w-full p-3 border rounded-lg opacity-60 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-100 border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Mã OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Nhập 6 chữ số"
                  maxLength={6}
                  required
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center text-2xl tracking-widest ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              <div className="flex gap-3">
                {!user?.email && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isDark
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className={`w-full text-center text-sm mt-2 transition-colors duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  isDark
                    ? "text-gray-400 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Chưa nhận được mã? Gửi lại OTP
              </button>
            </form>
          )}

          {/* BƯỚC 3: ĐẶT LẠI MẬT KHẨU */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  required
                  minLength={6}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  minLength={6}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm">
                    Mật khẩu xác nhận không khớp!
                  </p>
                )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                    isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading || newPassword !== confirmPassword}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                    isLoading || newPassword !== confirmPassword
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } ${
                    isDark
                      ? "bg-green-600 text-white hover:bg-green-500"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
