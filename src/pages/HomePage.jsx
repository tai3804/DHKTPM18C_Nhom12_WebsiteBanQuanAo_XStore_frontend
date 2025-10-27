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

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // //them moi
  // const { user } = useSelector(state => state.auth); // Lấy user
  const products = useSelector((state) => state.product.products); // Lấy sản phẩm từ store

  useEffect(() => {
    //fetch sản phẩm từ API ở đây
  }, [dispatch]);

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
        <FeaturedProducts products={products} />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
