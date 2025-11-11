// src/pages/RegisterPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Tự động chuyển hướng đến SendOtpPage
    navigate("/send-otp");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <p className="text-center text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
