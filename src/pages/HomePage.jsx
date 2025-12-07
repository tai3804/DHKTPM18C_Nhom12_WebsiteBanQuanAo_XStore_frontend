import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import HotProducts from "../components/home/HotProducts";
import SaleProducts from "../components/home/SaleProducts";
import BenefitsSection from "../components/home/BenefitsSection";
import { getProducts } from "../slices/ProductSlice";
import { getCartByUser } from "../slices/CartSlice";
import { selectThemeMode } from "../slices/ThemeSlice";
import {
  fetchAllTotalQuantities,
  fetchStockQuantities,
} from "../slices/StockSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products) || [];
  const { user } = useSelector((state) => state.auth);
  const { selectedStock } = useSelector((state) => state.stock);
  const themeMode = useSelector(selectThemeMode);

  // Load initial data
  useEffect(() => {
    // Load products
    dispatch(getProducts());
  }, [dispatch]);

  // ✅ Fetch stock data CHO TẤT CẢ products một lần duy nhất
  useEffect(() => {
    if (products.length > 0) {
      const productIds = products.map((p) => p.id);
      // Fetch total quantities cho tất cả products
      dispatch(fetchAllTotalQuantities(productIds));
    }
  }, [products.length, dispatch]);

  // ✅ Fetch selected stock quantities khi user chọn kho
  useEffect(() => {
    if (selectedStock?.id) {
      dispatch(fetchStockQuantities(selectedStock.id));
    }
  }, [selectedStock?.id, dispatch]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <HeroSection />
      <CategorySection />
      <HotProducts products={products} />
      <SaleProducts products={products} />
      <BenefitsSection />
    </div>
  );
}
