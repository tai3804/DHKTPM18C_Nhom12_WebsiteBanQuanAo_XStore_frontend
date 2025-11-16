// ManageProductsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";

import {
  getProducts,
  deleteProduct,
  getAllProductVariants,
} from "../../slices/ProductSlice";
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
  const { products, loading, allProductVariants } = useSelector(
    (state) => state.product
  );
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

  // Không cần load variants nữa vì đã có trong AdminLayout

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await dispatch(deleteProduct(id));
        toast.success("Đã xóa sản phẩm!");
        dispatch(getProducts());
        // Cập nhật variants sau khi xóa sản phẩm
        dispatch(getAllProductVariants());
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
    // Cập nhật variants sau khi products thay đổi
    dispatch(getAllProductVariants());
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
                  Màu sắc
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Kích thước
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Giá nhập
                </th>
                <th
                  className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Giá bán
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
              {filteredProducts.map((p) => {
                return (
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

                    {/* Màu sắc */}
                    <td className="px-4 py-3">
                      {allProductVariants[p.id]?.colors &&
                      allProductVariants[p.id].colors.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {allProductVariants[p.id].colors.map(
                            (color, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1"
                              >
                                <div
                                  className="w-4 h-4 rounded border border-gray-300"
                                  style={{ backgroundColor: color.hexCode }}
                                  title={color.name}
                                ></div>
                                {index <
                                  allProductVariants[p.id].colors.length -
                                    1 && (
                                  <span className="text-gray-400"></span>
                                )}
                              </div>
                            )
                          )}
                          {allProductVariants[p.id].colors.length >= 3 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`text-sm ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          N/A
                        </span>
                      )}
                    </td>

                    {/* Kích thước */}
                    <td className="px-4 py-3">
                      {allProductVariants[p.id]?.sizes &&
                      allProductVariants[p.id].sizes.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {allProductVariants[p.id].sizes.map((size, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1"
                            >
                              <span
                                className={`text-sm px-2 py-1 rounded border ${
                                  themeMode === "dark"
                                    ? "bg-gray-700 border-gray-600 text-gray-300"
                                    : "bg-gray-100 border-gray-300 text-gray-700"
                                }`}
                              >
                                {size}
                              </span>
                              {index <
                                allProductVariants[p.id].sizes.length - 1 && (
                                <span className="text-gray-400"></span>
                              )}
                            </div>
                          ))}
                          {allProductVariants[p.id].sizes.length >= 3 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`text-sm ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          N/A
                        </span>
                      )}
                    </td>

                    {/* Giá nhập */}
                    <td
                      className={`px-4 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {p.price?.toLocaleString()}₫
                    </td>

                    {/* Giá bán */}
                    <td
                      className={`px-4 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {p.priceInStock?.toLocaleString()}₫
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
                );
              })}
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
