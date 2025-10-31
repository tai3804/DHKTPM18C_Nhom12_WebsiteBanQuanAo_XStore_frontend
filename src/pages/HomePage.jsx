import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/header/Header';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import BenefitsSection from '../components/home/BenefitsSection';
import Footer from '../components/common/Footer';
import { getProducts } from '../slices/ProductSlice';
import { getCartByUser } from '../slices/CartSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products) || [];
  const { user } = useSelector((state) => state.auth);

  // ✅ Load products và cart khi component mount
  useEffect(() => {
    dispatch(getProducts());

    // Load cart nếu user đã đăng nhập
    if (user?.id) {
      dispatch(getCartByUser(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts products={products} />
      <BenefitsSection />
      <Footer />
    </div>
  );
}