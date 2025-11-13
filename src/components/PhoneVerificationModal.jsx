import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";
import { Phone, Check } from "lucide-react";

/**
 * Component để xác thực số điện thoại qua OTP
 * @param {string} phoneNumber - Số điện thoại cần xác thực
 * @param {function} onVerified - Callback khi xác thực thành công
 * @param {function} onCancel - Callback khi hủy
 * @param {string} themeMode - dark hoặc light
 */
export default function PhoneVerificationModal({
  phoneNumber: initialPhone,
  onVerified,
  onCancel,
  themeMode,
}) {
  const [step, setStep] = useState("input"); // input | otp | success
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Send OTP
  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    if (!/^0\d{9}$/.test(phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)");
      return;
    }

    setOtpLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.code === 200 || response.ok) {
        toast.success("✓ OTP đã được gửi!");
        setStep("otp");
        setTimer(60); // 60 seconds countdown

        // Start countdown timer
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.message || "Lỗi gửi OTP");
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }

    if (otpCode.length !== 6) {
      toast.error("Mã OTP phải là 6 chữ số");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          phoneNumber,
          otp: otpCode.toString(),
        }),
      });

      const data = await response.json();

      if (data.code === 200 || response.ok) {
        toast.success("✓ Xác thực số điện thoại thành công!");
        setStep("success");

        // Gọi callback sau 1.5s
        setTimeout(() => {
          onVerified(phoneNumber);
        }, 1500);
      } else {
        toast.error(data.message || "Mã OTP không đúng");
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-2xl p-8 w-96 max-w-lg transition-colors ${
          themeMode === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        {step === "input" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Phone size={24} />
              Xác thực số điện thoại
            </h2>

            <p
              className={
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }
            >
              Nhập số điện thoại để nhận mã OTP xác thực
            </p>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0912345678"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  themeMode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
                    : "bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className={`flex-1 py-2 rounded-lg border-2 transition ${
                  themeMode === "dark"
                    ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Hủy
              </button>
              <button
                onClick={handleSendOTP}
                disabled={otpLoading}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {otpLoading ? "Đang gửi..." : "Gửi OTP"}
              </button>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Nhập mã OTP</h2>

            <p
              className={
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }
            >
              Mã OTP đã được gửi đến {phoneNumber}
            </p>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Mã OTP (6 chữ số)
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-center text-2xl tracking-widest font-mono ${
                  themeMode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
                    : "bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={timer > 0}
              className={`w-full py-2 text-sm transition ${
                timer > 0
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-indigo-600 hover:text-indigo-700"
              }`}
            >
              {timer > 0 ? `Gửi lại sau ${timer}s` : "Gửi lại mã OTP"}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("input")}
                className={`flex-1 py-2 rounded-lg border-2 transition ${
                  themeMode === "dark"
                    ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Quay lại
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Đang xác thực..." : "Xác thực"}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 text-center">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold">Xác thực thành công!</h2>
            <p
              className={
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }
            >
              Số điện thoại {phoneNumber} đã được xác thực
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
