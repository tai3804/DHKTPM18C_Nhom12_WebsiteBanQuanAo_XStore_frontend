// ManageProductsPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { getProducts, deleteProduct } from "../../slices/ProductSlice";
import {
  getProductTypes,
  setProductTypes,
} from "../../slices/ProductTypeSlice";
import ProductForm from "../../components/admin/ProductForm";
import ProductItem from "../../components/admin/ProductItem";

export default function ManageProductsPage() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const productTypes = useSelector((state) => state.productType.productTypes);

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      const result = await dispatch(getProductTypes());
      dispatch(setProductTypes(result));
    };
    fetchTypes();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await dispatch(deleteProduct(id));
        toast.success("Đã xóa sản phẩm!");
        dispatch(getProducts());
      } catch (err) {
        toast.error("Không thể xóa sản phẩm: " + err);
      }
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    dispatch(getProducts());
  };

  return (
    <div className="space-y-8 relative">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
        <Link
          to="/admin/dashboard"
          className="hover:underline text-gray-600 cursor-pointer transition-colors"
        >
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          to="/admin/products"
          className="hover:underline text-gray-600 cursor-pointer transition-colors"
        >
          Sản phẩm
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-500 text-sm">Quản lý danh sách sản phẩm</p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition cursor-pointer flex items-center gap-1"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div className="text-center text-gray-500 py-8">
          Đang tải danh sách sản phẩm...
        </div>
      ) : products && products.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {products.map((p) => (
            <ProductItem
              key={p.id}
              product={p}
              onEdit={() => handleEdit(p)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Không có sản phẩm nào.
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onCancel={handleCloseForm}
          onSuccess={handleSuccess}
          types={productTypes}
        />
      )}
    </div>
  );
}
