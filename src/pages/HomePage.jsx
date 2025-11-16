import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import NewCollectionSection from "../components/home/NewCollectionSection";
import HotProducts from "../components/home/HotProducts";
import SaleProducts from "../components/home/SaleProducts";
import BenefitsSection from "../components/home/BenefitsSection";
import { getProducts } from "../slices/ProductSlice";
import { getCartByUser } from "../slices/CartSlice";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products) || [];
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);

  // Load initial data
  useEffect(() => {
    // Load products
    dispatch(getProducts());
  }, [dispatch]);

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
      <NewCollectionSection products={products} />
      <HotProducts products={products} />
      <SaleProducts products={products} />
      <BenefitsSection />
    </div>
  );
}
