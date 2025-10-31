import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../slices/ProductSlice';
import { getCartByUser } from '../slices/CartSlice';
import Header from '../components/header/Header';
import Footer from '../components/common/Footer';
import ProductList from '../components/product/ProductList';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const allProducts = useSelector((state) => state.product.products) || [];
  const { user } = useSelector((state) => state.auth);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ✅ Load products và cart
  useEffect(() => {
    dispatch(getProducts());

    // Load cart nếu user đã đăng nhập
    if (user?.id) {
      dispatch(getCartByUser(user.id));
    }
  }, [dispatch, user]);

  // Filter products khi allProducts hoặc category thay đổi
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }

    if (!category || category === 'all') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        product.type?.name === category
      );
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

        {category && category !== 'all' && filteredProducts.length === 0 && allProducts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Không tìm thấy sản phẩm cho danh mục "{category}".
              <button
                onClick={() => window.location.href = '/products'}
                className="ml-2 text-blue-600 hover:underline"
              >
                Xem tất cả sản phẩm
              </button>
            </p>
          </div>
        )}

        <ProductList products={filteredProducts} />
      </main>
      <Footer />
    </div>
  );
}