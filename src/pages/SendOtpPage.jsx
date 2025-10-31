import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendRegisterEmailOtp } from "../slices/AuthSlice";
import { useNavigate } from "react-router-dom";

function SendOtpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSendOtp = () => {
    if (!email) return alert("Vui lòng nhập email!");
    dispatch(sendRegisterEmailOtp(email));
    // navigate("/register", { state: { emailForOtp  : email } });
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOtp}>Gửi mã OTP</button>
    </div>
  );
}

export default SendOtpPage;
