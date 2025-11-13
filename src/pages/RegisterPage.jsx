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
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <p className="text-center text-gray-600 dark:text-gray-300">
          Đang chuyển hướng...
        </p>
      </div>
    </div>
  );
}
