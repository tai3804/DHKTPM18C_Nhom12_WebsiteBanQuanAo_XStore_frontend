import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Import cả 2 thunk gửi OTP
import { 
  sendResetPasswordOtp, // Email
  sendResetPasswordPhoneOtp, // Phone
  verifyOtp, 
  resetPassword 
} from "../slices/AuthSlice";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // THAY ĐỔI 1: Thêm 'selection' (chọn lựa) làm bước đầu tiên
  const [stage, setStage] = useState("selection"); // selection, send_form, verify_otp
  const [method, setMethod] = useState(null); // 'email' or 'phone'
  
  // State này sẽ lưu email HOẶC sđt
  const [contactInfo, setContactInfo] = useState(""); 
  
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Tự động điền thông tin nếu user đã đăng nhập
  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);
    setStage("send_form");
    if (user) {
      if (selectedMethod === 'email') {
        setContactInfo(user.email || "");
      } else if (selectedMethod === 'phone') {
        if (!user.phone) {
           toast.warn("Tài khoản của bạn chưa cập nhật SĐT. Vui lòng cập nhật ở trang cá nhân.");
           setStage("selection"); // Quay lại bước chọn
           return;
        }
        setContactInfo(user.phone || "");
      }
    } else {
      setContactInfo(""); // Nếu là khách thì form trống
    }
  };

  // --- GỬI YÊU CẦU OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!contactInfo) {
      toast.error(`Vui lòng nhập ${method === 'email' ? 'Email' : 'SĐT'}!`);
      return;
    }

    let resultAction;
    if (method === 'email') {
      resultAction = await dispatch(sendResetPasswordOtp(contactInfo));
    } else {
      resultAction = await dispatch(sendResetPasswordPhoneOtp(contactInfo));
    }

    if (resultAction.type.endsWith('fulfilled')) {
      setStage("verify_otp");
      // Thunk đã tự toast.success
    }
    // Thunk cũng đã tự toast.error (ví dụ: User not found)
  };

  // --- XÁC THỰC OTP VÀ ĐẶT LẠI MẬT KHẨU ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không trùng khớp!");
      return;
    }

    // Dùng contactInfo (email hoặc sđt) để xác thực
    const verifyAction = await dispatch(verifyOtp({ contact: contactInfo, otp }));

    if (verifyOtp.fulfilled.match(verifyAction)) {
      
      // Backend (AuthController) đã "thông minh"
      // nó tự check contactInfo là email hay sđt
      const resetAction = await dispatch(
        resetPassword({ username: contactInfo, newPassword: newPassword })
      );

      if (resetPassword.fulfilled.match(resetAction)) {
        if (user) {
          toast.success("Đổi mật khẩu thành công!");
          navigate("/user");
        } else {
          toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
          navigate("/login");
        }
      } else {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } else {
      toast.error("OTP không hợp lệ hoặc đã hết hạn!");
    }
  };
  
  // Hàm quay lại
  const goBack = () => {
    setStage('selection');
    // Tự động reset contactInfo về giá trị (nếu có) hoặc rỗng
    if (user) {
        setContactInfo(method === 'email' ? (user.email || "") : (user.phone || ""));
    } else {
        setContactInfo("");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            {user ? "Đổi Mật Khẩu" : "Đặt Lại Mật Khẩu"}
          </h2>

          {/* === GIAI ĐOẠN 0: CHỌN LỰA === */}
          {stage === "selection" && (
            <div className="space-y-4">
               <p className="text-center text-gray-600">
                Bạn muốn xác thực bằng phương thức nào?
              </p>
              <button
                type="button"
                onClick={() => handleMethodSelect('email')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sử dụng Email
              </button>
              <button
                type="button"
                onClick={() => handleMethodSelect('phone')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
              >
                Sử dụng SĐT
              </button>
            </div>
          )}

          {/* === GIAI ĐOẠN 1: GỬI OTP === */}
          {stage === "send_form" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <p className="text-center text-gray-600">
                Nhập {method === 'email' ? 'Email' : 'SĐT'} của bạn để nhận mã OTP.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  {method === 'email' ? 'Email' : 'Số Điện Thoại'}
                </label>
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                  // Khóa nếu đã đăng nhập (vá lỗi bảo mật)
                  disabled={!!user} 
                  className={`w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${user ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-sm"
              >
                Gửi OTP
              </button>
              <button
                type="button"
                onClick={goBack}
                className="w-full text-center text-sm text-gray-600 hover:text-blue-500"
              >
                Quay lại
              </button>
            </form>
          )}

          {/* === GIAI ĐOẠN 2: XÁC THỰC VÀ ĐỔI MẬT KHẨU === */}
          {stage === "verify_otp" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-center text-gray-600">
                Mã OTP đã được gửi đến: <strong>{contactInfo}</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Mã OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                Xác nhận và Đổi mật khẩu
              </button>
              <button
                type="button"
                onClick={goBack} // Quay lại bước chọn
                className="w-full text-center text-sm text-gray-600 hover:text-blue-500"
              >
                Gửi lại mã?
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}