import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductSales,
  deleteProductSales,
} from "../../slices/ProductSalesSlice";
import ProductSalesForm from "../../components/admin/ProductSalesForm";
import { toast } from "react-toastify";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { Link } from "react-router-dom";
import SearchBar from "../../components/admin/SearchBar";
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Percent,
  DollarSign,
  Package,
  ChevronDown,
} from "lucide-react";

export default function ManageProductSalePage() {
  const dispatch = useDispatch();
  const productSales =
    useSelector((state) => state.productSales.productSales) || [];
  const themeMode = useSelector(selectThemeMode);
  const [showForm, setShowForm] = useState(false);
  const [editingProductSales, setEditingProductSales] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ Không cần fetch nữa - đã được preload trong AdminLayout
  // useEffect(() => {
  //   dispatch(getProductSales());
  // }, [dispatch]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleAdd = () => {
    setEditingProductSales(null);
    setShowForm(true);
  };

  const handleEdit = (productSale) => {
    setEditingProductSales(productSale);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa giảm giá cho sản phẩm này?")) {
      try {
        await dispatch(deleteProductSales(productId)).unwrap();
        toast.success("Xóa giảm giá sản phẩm thành công!");
        dispatch(getProductSales()); // Refresh list
      } catch (error) {
        toast.error(`Lỗi khi xóa: ${error.message}`);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    dispatch(getProductSales()); // Refresh list
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const getProductSaleStatus = (productSale) => {
    const now = new Date();
    const start = productSale.startDate
      ? new Date(productSale.startDate)
      : null;
    const end = productSale.endDate ? new Date(productSale.endDate) : null;

    if (start && now < start) return "upcoming";
    if (end && now > end) return "expired";
    return "active";
  };

  // 🔍 Filter product sales based on search query and status
  const filteredProductSales = productSales.filter((productSale) => {
    const query = searchQuery.toLowerCase().trim();
    const productName = productSale.product?.name?.toLowerCase() || "";
    const productId = productSale.product?.id?.toString() || "";

    const matchSearch =
      !query || productName.includes(query) || productId.includes(query);

    if (!matchSearch) return false;

    if (statusFilter === "all") return true;
    return getProductSaleStatus(productSale) === statusFilter;
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "Không giới hạn";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (productSale) => {
    const now = new Date();
    const start = productSale.startDate
      ? new Date(productSale.startDate)
      : null;
    const end = productSale.endDate ? new Date(productSale.endDate) : null;

    if (start && now < start) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          Sắp diễn ra
        </span>
      );
    }

    if (end && now > end) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Đã kết thúc
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Đang hoạt động
      </span>
    );
  };

  return (
    <div className="space-y-6">
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
        <span
          className={`transition-colors ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Giảm giá sản phẩm
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Quản lý giảm giá sản phẩm
          </h1>
          <p
            className={`text-sm transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Quản lý các chương trình giảm giá
          </p>

          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo tên sản phẩm hoặc ID..."
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Dropdown lọc theo trạng thái */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Tag size={18} />
              {statusFilter === "all" && "Tất cả"}
              {statusFilter === "active" && "Đang hoạt động"}
              {statusFilter === "upcoming" && "Sắp diễn ra"}
              {statusFilter === "expired" && "Đã kết thúc"}
              <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-10 transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "active", label: "Đang hoạt động" },
                  { value: "upcoming", label: "Sắp diễn ra" },
                  { value: "expired", label: "Đã kết thúc" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${
                      statusFilter === option.value
                        ? themeMode === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-100"
                        : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            Thêm giảm giá
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-lg border transition-colors ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Package
              className={`h-5 w-5 ${
                themeMode === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Sản phẩm giảm giá
            </span>
          </div>
          <p
            className={`text-2xl font-bold transition-colors duration-300 mt-2 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {productSales.length}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border transition-colors ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag
              className={`h-5 w-5 ${
                themeMode === "dark" ? "text-orange-400" : "text-orange-500"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Đang hoạt động
            </span>
          </div>
          <p
            className={`text-2xl font-bold transition-colors duration-300 mt-2 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {
              filteredProductSales.filter((ps) => {
                const now = new Date();
                const start = ps.startDate ? new Date(ps.startDate) : null;
                const end = ps.endDate ? new Date(ps.endDate) : null;
                return (!start || now >= start) && (!end || now <= end);
              }).length
            }
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border transition-colors ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Percent
              className={`h-5 w-5 ${
                themeMode === "dark" ? "text-green-400" : "text-green-500"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Trung bình giảm
            </span>
          </div>
          <p
            className={`text-2xl font-bold transition-colors duration-300 mt-2 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {filteredProductSales.length > 0
              ? Math.round(
                  filteredProductSales.reduce(
                    (sum, ps) => sum + ps.discountPercent,
                    0
                  ) / filteredProductSales.length
                )
              : 0}
            %
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border transition-colors ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <DollarSign
              className={`h-5 w-5 ${
                themeMode === "dark" ? "text-purple-400" : "text-purple-500"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Tiết kiệm tổng
            </span>
          </div>
          <p
            className={`text-2xl font-bold transition-colors duration-300 mt-2 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {filteredProductSales
              .reduce((sum, ps) => {
                const original = ps.product?.price || 0;
                const discounted = ps.discountedPrice || 0;
                return sum + (original - discounted);
              }, 0)
              .toLocaleString()}{" "}
            đ
          </p>
        </div>
      </div>

      {/* Product Sales Table */}
      <div
        className={`rounded-lg border overflow-hidden transition-colors ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className={`border-b transition-colors ${
                themeMode === "dark"
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wider`}
                >
                  Sản phẩm
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wider`}
                >
                  Giá gốc
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wider`}
                >
                  Giảm giá
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wider`}
                >
                  Tiết kiệm
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wider`}
                >
                  Thời gian
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wider`}
                >
                  Trạng thái
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  } uppercase tracking-wider`}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y transition-colors ${
                themeMode === "dark" ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {filteredProductSales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Package
                      className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                        themeMode === "dark" ? "text-gray-600" : "text-gray-300"
                      }`}
                    />
                    <p
                      className={`text-lg font-light transition-colors ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {searchQuery
                        ? "Không tìm thấy sản phẩm giảm giá nào khớp với tìm kiếm"
                        : "Chưa có sản phẩm nào được giảm giá"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProductSales.map((productSale) => (
                  <tr
                    key={productSale.product?.id}
                    className={`transition-colors ${
                      themeMode === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div
                          className={`text-sm font-medium transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-100"
                              : "text-gray-800"
                          }`}
                        >
                          {productSale.product?.name}
                        </div>
                        <div
                          className={`text-sm transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          ID: {productSale.product?.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`text-sm transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-800"
                        }`}
                      >
                        {productSale.product?.price?.toLocaleString()} đ
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`text-sm transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-800"
                        }`}
                      >
                        <div>{productSale.discountPercent}%</div>
                        <div
                          className={`transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {productSale.discountedPrice?.toLocaleString()} đ
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {(
                          productSale.product?.price -
                          productSale.discountedPrice
                        )?.toLocaleString()}{" "}
                        đ
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`text-sm transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDateTime(productSale.startDate)}
                        </div>
                        <div
                          className={`transition-colors duration-300 mt-1 ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          đến {formatDateTime(productSale.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(productSale)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(productSale)}
                          className={`p-1 transition-colors ${
                            themeMode === "dark"
                              ? "text-indigo-400 hover:text-indigo-300"
                              : "text-indigo-600 hover:text-indigo-900"
                          }`}
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(productSale.product?.id)}
                          className={`p-1 transition-colors ${
                            themeMode === "dark"
                              ? "text-red-400 hover:text-red-300"
                              : "text-red-600 hover:text-red-900"
                          }`}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProductSalesForm
          productSales={editingProductSales}
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
