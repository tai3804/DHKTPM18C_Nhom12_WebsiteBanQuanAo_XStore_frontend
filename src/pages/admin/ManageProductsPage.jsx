// ManageProductsPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";

import { getProducts, deleteProduct } from "../../slices/ProductSlice";
import { getImageUrl } from "../../utils/imageUrl";
import {
  getProductTypes,
  setProductTypes,
} from "../../slices/ProductTypeSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import ProductForm from "../../components/admin/ProductForm";
import SearchBar from "../../components/admin/SearchBar";

export default function ManageProductsPage() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const productTypes = useSelector((state) => state.productType.productTypes);
  const themeMode = useSelector(selectThemeMode);

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // 🔍 Filter products dựa trên searchQuery
  const filteredProducts = products?.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.type?.name?.toLowerCase().includes(query) ||
      p.color?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 relative">
      {/* Breadcrumb */}
      <div
        className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-500" : "text-gray-500"
        }`}
      >
        <Link
          to="/admin/dashboard"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          to="/admin/products"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sản phẩm
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="shrink-0">
          <h1
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Quản lý sản phẩm
          </h1>
          <p
            className={`text-sm transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Quản lý danh sách sản phẩm
          </p>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo tên, thương hiệu, loại, màu sắc..."
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`px-4 py-2 text-white text-sm rounded-lg transition cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
            themeMode === "dark"
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div
          className={`text-center py-8 transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Đang tải danh sách sản phẩm...
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div
          className={`rounded-xl shadow-sm border overflow-x-auto transition-colors duration-300 ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <table className="w-full text-left border-collapse min-w-max">
            <thead
              className={`border-b transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <tr>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Hình ảnh
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Tên sản phẩm
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Thương hiệu
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Loại
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Chất liệu
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Màu sắc
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Kích cỡ
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Giá bán
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Tồn kho
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 text-right ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b hover:transition cursor-pointer transition-colors duration-300 ${
                    themeMode === "dark"
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  {/* Hình ảnh */}
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          themeMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`text-xs ${
                            themeMode === "dark"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          N/A
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Tên sản phẩm */}
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {p.name}
                  </td>

                  {/* Thương hiệu */}
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {p.brand || "N/A"}
                  </td>

                  {/* Loại */}
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {p.type?.name || "N/A"}
                  </td>

                  {/* Chất liệu */}
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {p.fabric || "N/A"}
                  </td>

                  {/* Màu sắc */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap items-center">
                      {p.colors && p.colors.length > 0 ? (
                        <>
                          {p.colors.slice(0, 3).map((color, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1"
                              title={
                                typeof color === "object" ? color.name : color
                              }
                            >
                              <div
                                className="w-5 h-5 rounded-full border"
                                style={{
                                  backgroundColor:
                                    typeof color === "object"
                                      ? color.hexCode
                                      : color,
                                }}
                              />
                            </div>
                          ))}
                          {p.colors.length > 3 && (
                            <span
                              className={`text-xs font-semibold ${
                                themeMode === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              +{p.colors.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span
                          className={`text-xs ${
                            themeMode === "dark"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          N/A
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Kích cỡ */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap items-center">
                      {p.sizes && p.sizes.length > 0 ? (
                        <>
                          {p.sizes.slice(0, 3).map((size, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 text-xs rounded ${
                                themeMode === "dark"
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {typeof size === "object" ? size.name : size}
                            </span>
                          ))}
                          {p.sizes.length > 3 && (
                            <span
                              className={`text-xs font-semibold ${
                                themeMode === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              +{p.sizes.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span
                          className={`text-xs ${
                            themeMode === "dark"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          N/A
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Giá bán */}
                  <td
                    className={`px-4 py-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {p.price?.toLocaleString()}₫
                  </td>

                  {/* Tồn kho */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        p.priceInStock > 0
                          ? themeMode === "dark"
                            ? "bg-green-900/30 text-green-300"
                            : "bg-green-100 text-green-700"
                          : themeMode === "dark"
                          ? "bg-red-900/30 text-red-300"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.priceInStock > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </td>

                  {/* Hành động */}
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="inline-flex text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      title="Sửa sản phẩm"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="inline-flex text-red-600 hover:text-red-800 transition cursor-pointer"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={`text-center py-8 transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {searchQuery
            ? "Không tìm thấy sản phẩm nào khớp với tìm kiếm."
            : "Không có sản phẩm nào."}
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
