import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../slices/ProductSlice';
import Header from '../components/header/Header';
import Footer from '../components/common/Footer';
import ProductList from '../components/product/ProductList';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const allProducts = useSelector((state) => state.product.products) || [];
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ✅ Load products khi mount
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // ✅ Filter products khi allProducts hoặc category thay đổi
  useEffect(() => {
    console.log('🔍 All Products:', allProducts);
    console.log('🔍 Category:', category);

    if (!allProducts || allProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }

    if (!category || category === 'all') {
      // Hiển thị tất cả
      console.log('✅ Showing all products');
      setFilteredProducts(allProducts);
    } else {
      // Lọc theo type.name
      const filtered = allProducts.filter(product => {
        const match = product.type?.name === category;
        console.log(`Product: ${product.name}, Type: ${product.type?.name}, Match: ${match}`);
        return match;
      });

      console.log('✅ Filtered Products:', filtered);
      setFilteredProducts(filtered);
    }
  }, [allProducts, category]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {category && category !== 'all' ? `Danh mục: ${category}` : 'Tất cả sản phẩm'}
          </h1>
          <p className="text-gray-600 mt-2">
            Tìm thấy {filteredProducts.length} sản phẩm
          </p>
        </div>
        <ProductList products={filteredProducts} />
      </main>
      <Footer />
    </div>
  );
}