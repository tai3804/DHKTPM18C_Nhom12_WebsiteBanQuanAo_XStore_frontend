import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { API_BASE_URL } from "../../config/api";

const StockItemsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stockId } = useParams();
  const location = useLocation();
  const themeMode = useSelector(selectThemeMode);

  const [stock, setStock] = useState(location.state?.stock || null);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [editQuantityValue, setEditQuantityValue] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Fetch stock info if not provided in state
  useEffect(() => {
    if (!stock && stockId) {
      fetchStockInfo();
    }
  }, [stockId, stock]);

  // Fetch stock items
  useEffect(() => {
    if (stockId) {
      fetchStockItems();
    }
  }, [stockId]);

  const fetchStockInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/stocks/${stockId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStock(data.result);
      } else {
        toast.error("Không thể tải thông tin kho");
        navigate("/admin/stocks");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin kho");
      navigate("/admin/stocks");
    }
  };

  const fetchStockItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStockItems(data.result || []);
      } else {
        toast.error("Không thể tải danh sách sản phẩm trong kho");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sản phẩm trong kho");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleCloseProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  const handleEditQuantity = (productInfo) => {
    setEditingQuantity(productInfo.id);
    setEditQuantityValue(productInfo.quantity.toString());
  };

  const handleCancelEditQuantity = () => {
    setEditingQuantity(null);
    setEditQuantityValue("");
  };

  const handleSaveQuantity = async (productInfoId) => {
    try {
      const newQuantity = parseInt(editQuantityValue);
      if (isNaN(newQuantity) || newQuantity < 0) {
        toast.error("Số lượng không hợp lệ");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items?productInfoId=${productInfoId}&quantity=${newQuantity}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Cập nhật số lượng thành công");
        fetchStockItems();
        setEditingQuantity(null);
        setEditQuantityValue("");
      } else {
        toast.error("Không thể cập nhật số lượng");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật số lượng");
    }
  };

  const handleDeleteStockItem = async (productInfoId) => {
    if (!window.confirm("Bạn có chắc muốn xóa biến thể này khỏi kho?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items?productInfoId=${productInfoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Xóa biến thể khỏi kho thành công");
        fetchStockItems();
      } else {
        toast.error("Không thể xóa biến thể khỏi kho");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa biến thể khỏi kho");
    }
  };

  const toggleExpanded = (productId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  if (loading && !stock) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Breadcrumb */}
      <div
        className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <Link
          to="/admin/dashboard"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-300 hover:text-gray-100"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          to="/admin/stocks"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark"
              ? "text-gray-300 hover:text-gray-100"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Kho hàng
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-400">
          {stock?.name || "Chi tiết kho"}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate("/admin/stocks")}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                themeMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              title="Quay lại"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1
                className={`text-2xl font-bold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {stock?.name || "Chi tiết kho"}
              </h1>
              <p
                className={`text-sm transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Quản lý sản phẩm trong kho
              </p>
            </div>
          </div>

          {/* Stock Info */}
          {stock && (
            <div className="mt-4 p-4 rounded-lg border transition-colors duration-300 bg-opacity-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Email:
                  </span>
                  <p
                    className={`mt-1 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {stock.email || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Điện thoại:
                  </span>
                  <p
                    className={`mt-1 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {stock.phone || "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Địa chỉ:
                  </span>
                  <p
                    className={`mt-1 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {stock.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Product Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddProduct}
            className={`px-4 py-2 text-white text-sm rounded-lg transition cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              themeMode === "dark"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-xl shadow-sm border transition-colors duration-300 flex flex-col items-start ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng sản phẩm
            </span>
          </div>
          <span
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {stockItems.length}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl shadow-sm border transition-colors duration-300 flex flex-col items-start ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-green-500" />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng số lượng
            </span>
          </div>
          <span
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {stockItems.reduce((sum, item) => sum + item.totalQuantity, 0)}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl shadow-sm border transition-colors duration-300 flex flex-col items-start ${
            themeMode === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-yellow-500" />
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Sản phẩm hết hàng
            </span>
          </div>
          <span
            className={`text-2xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {stockItems.filter((item) => item.totalQuantity === 0).length}
          </span>
        </div>
      </div>

      {/* Products Table */}
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
                ID
              </th>
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
                Số lượng tổng
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Đang tải danh sách sản phẩm...
                </td>
              </tr>
            ) : stockItems.length > 0 ? (
              stockItems.map((product) => (
                <React.Fragment key={product.id}>
                  <tr
                    className={`border-b hover:transition cursor-pointer transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleExpanded(product.id)}
                  >
                    <td
                      className={`px-4 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {product.id}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={product.image || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td
                      className={`px-4 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {product.name}
                    </td>
                    <td
                      className={`px-4 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {product.brand || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {product.totalQuantity}
                    </td>
                  </tr>
                  {expandedRows.has(product.id) &&
                    product.variants.map((variant) => (
                      <tr
                        key={variant.id}
                        className={`border-b transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-2 pl-8">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: variant.colorHexCode }}
                            ></div>
                            <span
                              className={`text-sm transition-colors duration-300 ${
                                themeMode === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {variant.colorName} - {variant.sizeName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {variant.image && (
                            <img
                              src={variant.image}
                              alt={`${variant.colorName} ${variant.sizeName}`}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2">
                          {editingQuantity === variant.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={editQuantityValue}
                                onChange={(e) =>
                                  setEditQuantityValue(e.target.value)
                                }
                                className={`w-20 px-2 py-1 border rounded transition-colors duration-300 ${
                                  themeMode === "dark"
                                    ? "border-gray-600 bg-gray-700 text-gray-100"
                                    : "border-gray-300 bg-white text-gray-900"
                                }`}
                              />
                              <button
                                onClick={() => handleSaveQuantity(variant.id)}
                                className="text-green-600 hover:text-green-800 transition cursor-pointer"
                                title="Lưu"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEditQuantity}
                                className="text-red-600 hover:text-red-800 transition cursor-pointer"
                                title="Hủy"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`transition-colors duration-300 ${
                                themeMode === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              }`}
                            >
                              {variant.quantity}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditQuantity(variant);
                            }}
                            className={`transition-colors duration-300 ${
                              themeMode === "dark"
                                ? "text-yellow-400 hover:text-yellow-300"
                                : "text-yellow-600 hover:text-yellow-800"
                            }`}
                            title="Chỉnh sửa số lượng"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStockItem(variant.id);
                            }}
                            className={`transition-colors duration-300 ${
                              themeMode === "dark"
                                ? "text-red-400 hover:text-red-300"
                                : "text-red-600 hover:text-red-800"
                            }`}
                            title="Xóa khỏi kho"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className={`py-6 text-center transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Kho này chưa có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <AddProductToStockModal
          stockId={stockId}
          onClose={handleCloseAddForm}
          onSuccess={fetchStockItems}
        />
      )}

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={handleCloseProductDetails}
        />
      )}
    </div>
  );
};

// Add Product to Stock Modal Component
const AddProductToStockModal = ({ stockId, onClose, onSuccess }) => {
  const themeMode = useSelector(selectThemeMode);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductInfoId, setSelectedProductInfoId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Flatten productInfos
        const productInfos = [];
        (data.result || []).forEach((product) => {
          if (product.productInfos) {
            product.productInfos.forEach((info) => {
              productInfos.push({
                ...info,
                product: product,
              });
            });
          }
        });
        setProducts(productInfos);
      } else {
        toast.error("Không thể tải danh sách sản phẩm");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (info) =>
      info.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.colorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.sizeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductInfoId || quantity <= 0) {
      toast.error("Vui lòng chọn biến thể sản phẩm và nhập số lượng hợp lệ");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items?productInfoId=${selectedProductInfoId}&quantity=${quantity}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Thêm sản phẩm vào kho thành công");
        onSuccess();
        onClose();
      } else {
        toast.error("Không thể thêm sản phẩm vào kho");
      }
    } catch (error) {
      toast.error("Lỗi khi thêm sản phẩm vào kho");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg border max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm vào kho</h3>

        <form onSubmit={handleSubmit}>
          {/* Search Products */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Tìm kiếm sản phẩm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên sản phẩm hoặc thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "border-gray-600 bg-gray-700 text-gray-100"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Chọn biến thể sản phẩm
            </label>
            <select
              value={selectedProductInfoId}
              onChange={(e) => setSelectedProductInfoId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg transition-colors duration-300 ${
                themeMode === "dark"
                  ? "border-gray-600 bg-gray-700 text-gray-100"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
              required
            >
              <option value="">Chọn biến thể sản phẩm...</option>
              {loading ? (
                <option disabled>Đang tải...</option>
              ) : (
                filteredProducts.map((info) => (
                  <option key={info.id} value={info.id}>
                    {info.product.name} - {info.colorName} - {info.sizeName} (
                    {info.product.brand || "N/A"})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Số lượng</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className={`w-full px-3 py-2 border rounded-lg transition-colors duration-300 ${
                themeMode === "dark"
                  ? "border-gray-600 bg-gray-700 text-gray-100"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                themeMode === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
            >
              Thêm vào kho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Product Details Modal Component
const ProductDetailsModal = ({ product, onClose }) => {
  const themeMode = useSelector(selectThemeMode);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg border max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Chi tiết sản phẩm</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              themeMode === "dark"
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Info */}
          <div>
            <div className="mb-4">
              <img
                src={product.image || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Tên sản phẩm:
                </span>
                <p
                  className={`mt-1 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {product.name}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Thương hiệu:
                </span>
                <p
                  className={`mt-1 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {product.brand || "N/A"}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Loại sản phẩm:
                </span>
                <p
                  className={`mt-1 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {product.type?.name || "N/A"}
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  Giá:
                </span>
                <p
                  className={`mt-1 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {product.price?.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div>
            <h4 className="text-lg font-medium mb-4">Biến thể sản phẩm</h4>

            {product.variants && product.variants.length > 0 ? (
              <div className="space-y-4">
                {product.variants.map((info) => (
                  <div
                    key={info.id}
                    className={`p-4 rounded-lg border transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Màu sắc:
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: info.colorHexCode }}
                          ></div>
                          <span
                            className={`transition-colors duration-300 ${
                              themeMode === "dark"
                                ? "text-gray-200"
                                : "text-gray-800"
                            }`}
                          >
                            {info.colorName}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Size:
                        </span>
                        <p
                          className={`mt-1 transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-200"
                              : "text-gray-800"
                          }`}
                        >
                          {info.sizeName}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Số lượng trong kho:
                        </span>
                        <p
                          className={`mt-1 transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-200"
                              : "text-gray-800"
                          }`}
                        >
                          {info.quantity}
                        </p>
                      </div>

                      {info.image && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-500 dark:text-gray-400">
                            Hình ảnh:
                          </span>
                          <div className="mt-2">
                            <img
                              src={info.image}
                              alt={`${info.colorName} ${info.sizeName}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Không có thông tin biến thể
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockItemsPage;
