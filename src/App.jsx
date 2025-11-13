import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/HomePage";
import Contact from "./pages/ContactPage";
import Cart from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import SalePage from "./pages/SalePage";
import ProductsPage from "./pages/ProductsPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import RegisterInfoPage from "./pages/RegisterInfoPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import FAQPage from "./pages/FAQPage";
import ShoppingGuidePage from "./pages/ShoppingGuidePage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/ManageUsersPage";
import ProductsAdminPage from "./pages/admin/ManageProductsPage";
import ManageProductTypesPage from "./pages/admin/ManageProductTypePage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectThemeMode } from "./slices/ThemeSlice";
import { getProducts } from "./slices/ProductSlice";
import { getCartByUser } from "./slices/CartSlice";
import { getFavouritesByUser } from "./slices/FavouriteSlice";
import SendOtpPage from "./pages/SendOtpPage";
import FavouritePage from "./pages/FavouritePage";
import DebugPage from "./pages/DebugPage";
import HotPage from "./pages/HotPage";
import ManageStockPage from "./pages/admin/ManageStockPage";
import ManageDiscountsPage from "./pages/admin/ManageDiscountsPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
export default function App() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const themeMode = useSelector(selectThemeMode);

  // Initialize theme on mount
  useEffect(() => {
    console.log("App.jsx - Initial theme mode:", themeMode);
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const getDefaultItems = async () => {
      console.log("App.jsx - Dispatching getProducts()");
      const result = await dispatch(getProducts());
      console.log("App.jsx - getProducts result:", result);

      // Chỉ load cart và favourites nếu có user đã login
      if (user?.id) {
        dispatch(getCartByUser(user.id));
        dispatch(getFavouritesByUser(user.id));
      }
    };
    getDefaultItems();
  }, [dispatch, user]);

  // Apply theme class to <html> based on Redux state
  useEffect(() => {
    console.log("App.jsx - Theme mode changed to:", themeMode);
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
      console.log("Added dark class");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("Removed dark class");
    }
  }, [themeMode]);

  return (
    <div>
      <Routes>
        {/* Routes public */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/order-confirmation/:orderId"
          element={<OrderConfirmationPage />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/shopping-guide" element={<ShoppingGuidePage />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/hot" element={<HotPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/send-otp" element={<SendOtpPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/register-info" element={<RegisterInfoPage />} />
        <Route path="/favourite" element={<FavouritePage />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

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
          <Route path="stocks" element={<ManageStockPage />} />
          <Route path="discounts" element={<ManageDiscountsPage />} />
          <Route path="orders" element={<ManageOrdersPage />} />
        </Route>
      </Routes>

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeMode === "dark" ? "dark" : "light"}
        style={{ top: "80px" }}
        toastStyle={{
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      />
    </div>
  );
}
