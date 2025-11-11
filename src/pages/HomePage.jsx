import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/header/Header";
import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import HotProducts from "../components/home/HotProducts";
import SaleProducts from "../components/home/SaleProducts";
import BenefitsSection from "../components/home/BenefitsSection";
import Footer from "../components/common/Footer";
import { getProducts } from "../slices/ProductSlice";
import { getProductTypes } from "../slices/ProductTypeSlice";
import { getCartByUser } from "../slices/CartSlice";

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products) || [];
  const productTypes =
    useSelector((state) => state.productType.productTypes) || [];
  const { user } = useSelector((state) => state.auth);

  // Load initial data
  useEffect(() => {
    // Load product types for categories
    dispatch(getProductTypes());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CategorySection productTypes={productTypes} />
      <HotProducts products={products} />
      <SaleProducts products={products} />
      <BenefitsSection />
      <Footer />
    </div>
  );
}
