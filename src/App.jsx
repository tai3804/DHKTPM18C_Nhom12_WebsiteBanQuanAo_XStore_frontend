import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/HomePage";
import Contact from "./pages/ContactPage";
import Cart from "./pages/CartPage";
import SalePage from "./pages/SalePage";
import ProductsPage from "./pages/ProductsPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/ManageUsersPage";
import ProductsAdminPage from "./pages/admin/ManageProductsPage";
import ManageProductTypesPage from "./pages/admin/ManageProductTypePage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "./slices/ProductSlice";
import SendOtpPage from "./pages/SendOtpPage";

export default function App() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    const getDefaultItems = async () => {
      dispatch(getProducts());
    };
    getDefaultItems();
  }, []);

  return (
    <div>
      <Routes>
        {/* Routes public */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/send-otp" element={<SendOtpPage />} />

        {/* ✅ Khu vực ADMIN có nhiều route con */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsAdminPage />} />
          <Route path="product-types" element={<ManageProductTypesPage />} />
        </Route>
      </Routes>

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover={true}
        draggable
        theme="light"
        style={{ top: "80px" }}
      />
    </div>
  );
}
