import { useSelector } from 'react-redux';
import Header from '../components/header/Header';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BenefitsSection from '../components/home/BenefitsSection';
import Footer from '../components/common/Footer';

export default function HomePage() {
  // ✅ Lấy products từ Redux store
  const products = useSelector((state) => state.product.products) || [];

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts products={products} /> {/* ✅ Truyền products */}
      <BenefitsSection />
      <Footer />
    </div>
  );
}