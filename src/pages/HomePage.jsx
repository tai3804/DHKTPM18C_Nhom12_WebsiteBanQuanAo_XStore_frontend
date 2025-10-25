import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../components/header/Header";
import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BenefitsSection from "../components/home/BenefitsSection";
import Footer from "../components/common/Footer";
// import { setUser } from "../slices/AuthSlice"; // lấy user

//dữ liệu sản phẩm mẫu
const sampleProducts = [
  {
    id: "1",
    name: "Áo Thun Basic",
    price: 250000,
    image: "https://via.placeholder.com/300x300/e0f2fe/868e96?text=Ao+Thun",
    isFavorite: false,
  },
  {
    id: "2",
    name: "Quần Jeans Slimfit",
    price: 550000,
    image: "https://via.placeholder.com/300x300/dbeafe/868e96?text=Quan+Jeans",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Váy Hoa Vintage",
    price: 480000,
    image: "https://via.placeholder.com/300x300/ede9fe/868e96?text=Vay+Hoa",
    isFavorite: false,
  },
  {
    id: "4",
    name: "Đầm Maxi Voan",
    price: 720000,
    image: "https://via.placeholder.com/300x300/fee2e2/868e96?text=Dam+Maxi",
    isFavorite: false,
  },
  {
    id: "5",
    name: "Áo Khoác Bomber",
    price: 680000,
    image: "https://via.placeholder.com/300x300/dcfce7/868e96?text=Ao+Khoac",
    isFavorite: true,
  },
  {
    id: "6",
    name: "Túi Tote Canvas",
    price: 180000,
    image: "https://via.placeholder.com/300x300/f3e8ff/868e96?text=Tui+Tote",
    isFavorite: false,
  },
  {
    id: "7",
    name: "Nón Beanie Len",
    price: 150000,
    image: "https://via.placeholder.com/300x300/fef3c7/868e96?text=Non+Beanie",
    isFavorite: false,
  },
  {
    id: "8",
    name: "Áo Sơ Mi Lụa",
    price: 420000,
    image: "https://via.placeholder.com/300x300/ecfdf5/868e96?text=Ao+So+Mi",
    isFavorite: false,
  },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // //them moi
  // const { user } = useSelector(state => state.auth); // Lấy user

  const [products, setProducts] = useState(sampleProducts);

  useEffect(() => {
    //fetch sản phẩm từ API ở đây
  }, [dispatch]);

  //Hàm xử lý thêm vào giỏ hàng (cần tạo CartSlice và thunk)
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // dispatch(addToCartThunk(product));
    alert(`${product.name} đã được thêm vào giỏ!`); // tạm thời
  };

  //Hàm xử lý yêu thích (cần tạo FavouriteSlice và thunk)
  const handleToggleFavorite = (productId) => {
    console.log("Toggling favorite:", productId);
    // Cập nhật state tạm thời
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
    // dispatch(toggleFavoriteThunk(productId));
  };

  //Hàm xử lý khi click vào sản phẩm (điều hướng đến trang chi tiết)
  const handleProductClick = (product) => {
    console.log("Navigating to product:", product);
    // navigate(`/products/${product.id}`); // Điều hướng đến trang chi tiết
  };

  //Hàm xử lý điều hướng từ CategorySection
  const handleNavigate = (page) => {
    console.log("Navigating to page:", page);
    if (page === "products") {
      navigate("/products");
    } else if (page === "sale") {
      navigate("/sale");
    } else {
      // Điều hướng đến trang danh mục cụ thể (ví dụ: /products?category=shirts)
      navigate(`/products?category=${page}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategorySection onNavigate={handleNavigate} />
        <FeaturedProducts
          products={products}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          onProductClick={handleProductClick}
        />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
