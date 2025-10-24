import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";

export default function ProtectedRoute({ children }) {
  const { user: reduxUser, token: reduxToken } = useSelector(state => state.auth);

  const localUser = JSON.parse(localStorage.getItem("user"));
  const localToken = localStorage.getItem("token");

  const user = reduxUser || localUser;
  const token = reduxToken || localToken;

  // Nếu chưa đăng nhập
  if (!user || !token) {
    toast.error("Vui lòng đăng nhập để truy cập!");
    return <Navigate to="/login" replace />;
  }

  // Nếu không đủ quyền (ví dụ chỉ ADMIN được vào)
  if ( user.account.role !== "ADMIN") {
    toast.error("Bạn không có quyền truy cập khu vực này!");
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {children}
    </>
  );
}
