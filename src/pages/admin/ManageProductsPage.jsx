// ManageProductsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Edit2, Trash2, Package, User, Shirt, Gem } from "lucide-react";

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
import StatsSection from "../../components/admin/StatsSection";

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

  // Thống kê sản phẩm
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    womenProducts: 0,
    menProducts: 0,
    accessoriesProducts: 0,
  });

  useEffect(() => {
    const fetchTypes = async () => {
      const result = await dispatch(getProductTypes());
      dispatch(setProductTypes(result));
    };
    fetchTypes();
  }, [dispatch]);

  // Tính toán thống kê sản phẩm
  useEffect(() => {
    if (products && productTypes) {
      const totalProducts = products.length;
      const womenProducts = products.filter((product) => {
        const categoryId =
          product.productTypeId || product.typeId || product.categoryId;
        const category = productTypes.find((pt) => pt.id === categoryId);
        return category && category.name.toLowerCase().includes("nữ");
      }).length;
      const menProducts = products.filter((product) => {
        const categoryId =
          product.productTypeId || product.typeId || product.categoryId;
        const category = productTypes.find((pt) => pt.id === categoryId);
        return category && category.name.toLowerCase().includes("nam");
      }).length;
      const accessoriesProducts = products.filter((product) => {
        const categoryId =
          product.productTypeId || product.typeId || product.categoryId;
        const category = productTypes.find((pt) => pt.id === categoryId);
        return (
          category &&
          (category.name.toLowerCase().includes("phụ kiện") ||
            category.name.toLowerCase().includes("accessories") ||
            category.name.toLowerCase().includes("phụ"))
        );
      }).length;

      setProductStats({
        totalProducts,
        womenProducts,
        menProducts,
        accessoriesProducts,
      });
    }
  }, [products, productTypes]);

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
      p.type?.name?.toLowerCase().includes(query)
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
              placeholder="Tìm kiếm theo tên, thương hiệu, loại..."
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

      {/* Thống kê sản phẩm */}
      <StatsSection
        stats={[
          {
            label: "Tổng sản phẩm",
            value: productStats.totalProducts,
            color: "bg-indigo-500",
            icon: <Package size={20} />,
          },
          {
            label: "Đồ nữ",
            value: productStats.womenProducts,
            color: "bg-pink-500",
            icon: <User size={20} />,
          },
          {
            label: "Đồ nam",
            value: productStats.menProducts,
            color: "bg-cyan-500",
            icon: <Shirt size={20} />,
          },
          {
            label: "Phụ kiện",
            value: productStats.accessoriesProducts,
            color: "bg-yellow-500",
            icon: <Gem size={20} />,
          },
        ]}
      />

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
                  Chi tiết
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

                    {/* Biến thể */}
                    <td className="px-4 py-3">
                      {allProductVariants[p.id] ? (
                        <div className="text-sm">
                          <div
                            className={`font-medium ${
                              themeMode === "dark"
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            {allProductVariants[p.id].colors?.length || 0} màu ×{" "}
                            {allProductVariants[p.id].sizes?.length || 0} size
                          </div>
                          <div
                            className={`text-xs ${
                              themeMode === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Tổng:{" "}
                            {(allProductVariants[p.id].colors?.length || 0) *
                              (allProductVariants[p.id].sizes?.length ||
                                0)}{" "}
                            biến thể
                          </div>
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
