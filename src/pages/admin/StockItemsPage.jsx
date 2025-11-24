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
import { getImageUrl } from "../../utils/imageUrl";

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
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectedVariants, setSelectedVariants] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [editQuantityValue, setEditQuantityValue] = useState("");

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

  const handleSelectProduct = (productId) => {
    const product = stockItems.find((p) => p.id === productId);
    if (!product || !product.variants) return;

    const newSelected = new Set(selectedVariants);
    const allSelected = product.variants.every((v) => newSelected.has(v.id));

    if (allSelected) {
      // Deselect all variants of this product
      product.variants.forEach((variant) => newSelected.delete(variant.id));
    } else {
      // Select all variants of this product
      product.variants.forEach((variant) => newSelected.add(variant.id));
    }
    setSelectedVariants(newSelected);
  };

  const handleSelectAll = () => {
    const allVariants = [];
    stockItems.forEach((product) => {
      if (product.variants) {
        product.variants.forEach((variant) => allVariants.push(variant.id));
      }
    });

    if (selectedVariants.size === allVariants.length) {
      setSelectedVariants(new Set());
    } else {
      setSelectedVariants(new Set(allVariants));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedVariants.size === 0) {
      toast.error("Vui lòng chọn biến thể để xóa");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc muốn xóa ${selectedVariants.size} biến thể đã chọn?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      for (const variantId of selectedVariants) {
        const response = await fetch(
          `${API_BASE_URL}/api/stocks/${stockId}/items?productInfoId=${variantId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to delete variant ${variantId}`);
        }
      }

      toast.success("Đã xóa các biến thể đã chọn");
      fetchStockItems();
      setSelectedVariants(new Set());
    } catch (error) {
      toast.error("Lỗi khi xóa biến thể");
    }
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
                    {stock.address?.fullAddress || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Product Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedVariants.size === 0}
            className={`px-4 py-2 text-white text-sm rounded-lg transition cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              selectedVariants.size === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <Trash2 size={18} />
            Xóa đã chọn ({selectedVariants.size})
          </button>
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
        <div className="max-h-96 overflow-y-auto">
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
                  <input
                    type="checkbox"
                    checked={(() => {
                      const allVariants = [];
                      stockItems.forEach((product) => {
                        if (product.variants) {
                          product.variants.forEach((variant) =>
                            allVariants.push(variant.id)
                          );
                        }
                      });
                      return (
                        allVariants.length > 0 &&
                        selectedVariants.size === allVariants.length
                      );
                    })()}
                    onChange={handleSelectAll}
                  />
                </th>
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
                    colSpan="7"
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
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={
                            product.variants &&
                            product.variants.every((v) =>
                              selectedVariants.has(v.id)
                            )
                          }
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectProduct(product.id);
                          }}
                        />
                      </td>
                      <td
                        className={`px-4 py-3 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        {product.id}
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={
                            getImageUrl(product.image) ||
                            "/placeholder-image.jpg"
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td
                        className={`px-4 py-3 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        {product.name}
                      </td>
                      <td
                        className={`px-4 py-3 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {product.brand || "N/A"}
                      </td>
                      <td
                        className={`px-4 py-3 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
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
                              <input
                                type="checkbox"
                                checked={selectedVariants.has(variant.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  const newSelected = new Set(selectedVariants);
                                  if (newSelected.has(variant.id)) {
                                    newSelected.delete(variant.id);
                                  } else {
                                    newSelected.add(variant.id);
                                  }
                                  setSelectedVariants(newSelected);
                                }}
                              />
                              <div
                                className="w-4 h-4 rounded border"
                                style={{
                                  backgroundColor: variant.colorHexCode,
                                }}
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
                                src={getImageUrl(variant.image)}
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
                    colSpan="7"
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
      </div>{" "}
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
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // Array of {productInfoId, quantity, productInfo}
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch all products
      const productsResponse = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch current stock items
      const stockResponse = await fetch(
        `${API_BASE_URL}/api/stocks/${stockId}/items`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (productsResponse.ok && stockResponse.ok) {
        const productsData = await productsResponse.json();
        const stockData = await stockResponse.json();

        setProducts(productsData.result || []);
        setStockItems(stockData.result || []);
      } else {
        toast.error("Không thể tải dữ liệu");
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Get product IDs that are already in stock
  const existingProductIds = new Set(
    stockItems.flatMap((item) =>
      item.variants ? item.variants.map((v) => v.id) : []
    )
  );

  // Filter out products that are already in stock
  const availableProducts = products.filter((product) =>
    product.productInfos?.some((info) => !existingProductIds.has(info.id))
  );

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSelect = (product) => {
    setCurrentProduct(product);
    setCurrentVariant(null);
    setCurrentQuantity(1);
  };

  const handleVariantSelect = (variant) => {
    setCurrentVariant(variant);
  };

  const handleAddToList = () => {
    if (!currentVariant || currentQuantity <= 0) {
      toast.error("Vui lòng chọn biến thể và nhập số lượng hợp lệ");
      return;
    }

    // Check if this variant is already in the selected list
    const existingIndex = selectedItems.findIndex(
      (item) => item.productInfoId === currentVariant.id
    );

    if (existingIndex >= 0) {
      // Update quantity if already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingIndex].quantity += currentQuantity;
      setSelectedItems(updatedItems);
      toast.success(
        `Đã cập nhật số lượng cho ${currentVariant.colorName} - ${currentVariant.sizeName}`
      );
    } else {
      // Add new item
      setSelectedItems([
        ...selectedItems,
        {
          productInfoId: currentVariant.id,
          quantity: currentQuantity,
          productInfo: {
            ...currentVariant,
            product: currentProduct,
          },
        },
      ]);
      toast.success(
        `Đã thêm ${currentVariant.colorName} - ${currentVariant.sizeName} vào danh sách`
      );
    }

    // Reset current selection
    setCurrentVariant(null);
    setCurrentQuantity(1);
  };

  const handleRemoveFromList = (productInfoId) => {
    setSelectedItems(
      selectedItems.filter((item) => item.productInfoId !== productInfoId)
    );
  };

  const handleUpdateQuantity = (productInfoId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromList(productInfoId);
      return;
    }

    setSelectedItems(
      selectedItems.map((item) =>
        item.productInfoId === productInfoId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleSubmitAll = async () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let successCount = 0;
      let errorCount = 0;

      for (const item of selectedItems) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/stocks/${stockId}/items?productInfoId=${item.productInfoId}&quantity=${item.quantity}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Đã thêm thành công ${successCount} sản phẩm vào kho`);
        onSuccess();
        setSelectedItems([]);
        if (errorCount === 0) {
          onClose();
        }
      }

      if (errorCount > 0) {
        toast.error(`Có ${errorCount} sản phẩm thêm thất bại`);
      }
    } catch (error) {
      toast.error("Lỗi khi thêm sản phẩm vào kho");
    }
  };

  const resetCurrentSelection = () => {
    setCurrentProduct(null);
    setCurrentVariant(null);
    setCurrentQuantity(1);
  };

  const clearAllSelections = () => {
    setSelectedItems([]);
    resetCurrentSelection();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b transition-colors duration-300 ${
            themeMode === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-xl font-bold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                <Package size={20} /> Thêm sản phẩm vào kho (
                {selectedItems.length} đã chọn)
              </h3>
              <p
                className={`text-sm mt-1 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Chọn nhiều sản phẩm và biến thể để thêm vào kho cùng lúc
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors duration-300 hover:scale-105 ${
                  themeMode === "dark"
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[600px] pb-24">
          {/* Left Panel - Product Selection */}
          <div
            className={`w-1/3 p-6 border-r transition-colors duration-300 ${
              themeMode === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    themeMode === "dark"
                      ? "border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="space-y-3 h-full overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                  <span
                    className={`ml-3 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Đang tải sản phẩm...
                  </span>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      currentProduct?.id === product.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : `border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 ${
                            themeMode === "dark"
                              ? "bg-gray-700/50"
                              : "bg-gray-50"
                          }`
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          getImageUrl(product.image) || "/placeholder-image.jpg"
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold truncate transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-100"
                              : "text-gray-800"
                          }`}
                        >
                          {product.name}
                        </h4>
                        <p
                          className={`text-sm transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {product.brand || "Không có thương hiệu"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                              themeMode === "dark"
                                ? "bg-gray-600 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {product.productInfos?.filter(
                              (info) => !existingProductIds.has(info.id)
                            ).length || 0}{" "}
                            biến thể
                          </span>
                        </div>
                      </div>
                      {currentProduct?.id === product.id && (
                        <div className="text-indigo-500">
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package
                    className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {searchQuery
                      ? "Không tìm thấy sản phẩm nào"
                      : "Tất cả sản phẩm đã có trong kho"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Panel - Variant Selection */}
          <div
            className={`w-1/3 p-6 border-r transition-colors duration-300 ${
              themeMode === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {currentProduct ? (
              <div className="space-y-6 h-full flex flex-col">
                {/* Selected Product Info */}
                <div
                  className={`p-4 rounded-xl border transition-colors duration-300 ${
                    themeMode === "dark"
                      ? "border-gray-600 bg-gray-700/50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={
                        getImageUrl(currentProduct.image) ||
                        "/placeholder-image.jpg"
                      }
                      alt={currentProduct.name}
                      className="w-10 h-10 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h4
                        className={`font-semibold transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-800"
                        }`}
                      >
                        {currentProduct.name}
                      </h4>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {currentProduct.brand || "Không có thương hiệu"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetCurrentSelection}
                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-300"
                  >
                    Chọn sản phẩm khác
                  </button>
                </div>

                {/* Variants */}
                <div className="flex-1 min-h-0">
                  <h4
                    className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Chọn biến thể
                  </h4>
                  <div className="grid grid-cols-1 gap-3 h-full overflow-y-auto">
                    {currentProduct.productInfos
                      ?.filter((info) => !existingProductIds.has(info.id))
                      .map((variant) => (
                        <div
                          key={variant.id}
                          onClick={() => handleVariantSelect(variant)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                            currentVariant?.id === variant.id
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                              : `border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 ${
                                  themeMode === "dark"
                                    ? "bg-gray-700/50"
                                    : "bg-gray-50"
                                }`
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {variant.image && (
                              <img
                                src={getImageUrl(variant.image)}
                                alt={`${variant.colorName} ${variant.sizeName}`}
                                className="w-8 h-8 object-cover rounded-lg shadow-sm"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                  style={{
                                    backgroundColor: variant.colorHexCode,
                                  }}
                                  title={variant.colorName}
                                ></div>
                                <span
                                  className={`text-sm font-medium transition-colors duration-300 ${
                                    themeMode === "dark"
                                      ? "text-gray-200"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {variant.colorName}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                                    themeMode === "dark"
                                      ? "bg-gray-600 text-gray-300"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {variant.sizeName}
                                </span>
                              </div>
                            </div>
                            {currentVariant?.id === variant.id && (
                              <div className="text-indigo-500">
                                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Quantity Input & Add Button */}
                {currentVariant && (
                  <div
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      themeMode === "dark"
                        ? "border-gray-600 bg-gray-700/50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <h4
                      className={`text-sm font-semibold mb-3 transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      Số lượng
                    </h4>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={currentQuantity}
                        onChange={(e) =>
                          setCurrentQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          themeMode === "dark"
                            ? "border-gray-600 bg-gray-700 text-gray-100"
                            : "border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                      <button
                        onClick={handleAddToList}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition cursor-pointer font-medium"
                      >
                        <Plus size={18} /> Thêm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Package
                  className={`w-16 h-16 mb-6 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h4
                  className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Chọn sản phẩm
                </h4>
                <p
                  className={`transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Chọn sản phẩm từ danh sách bên trái
                </p>
              </div>
            )}
          </div>

          {/* Right Panel - Selected Items */}
          <div className="w-1/3 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4
                className={`text-lg font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                📋 Đã chọn ({selectedItems.length})
              </h4>
              {selectedItems.length > 0 && (
                <button
                  onClick={clearAllSelections}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            <div className="space-y-3 h-full overflow-y-auto pr-2">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <div
                    key={item.productInfoId}
                    className={`p-4 rounded-xl border transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "border-gray-600 bg-gray-700/50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {item.productInfo.image && (
                        <img
                          src={getImageUrl(item.productInfo.image)}
                          alt={`${item.productInfo.colorName} ${item.productInfo.sizeName}`}
                          className="w-10 h-10 object-cover rounded-lg shadow-sm mt-1 shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h5
                          className={`font-medium truncate transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-100"
                              : "text-gray-800"
                          }`}
                        >
                          {item.productInfo.product.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300 shrink-0"
                            style={{
                              backgroundColor: item.productInfo.colorHexCode,
                            }}
                          ></div>
                          <span
                            className={`text-sm transition-colors duration-300 ${
                              themeMode === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {item.productInfo.colorName} -{" "}
                            {item.productInfo.sizeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.productInfoId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className={`w-20 px-2 py-1 text-sm border rounded transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shrink-0 ${
                              themeMode === "dark"
                                ? "border-gray-600 bg-gray-700 text-gray-100"
                                : "border-gray-300 bg-white text-gray-900"
                            }`}
                          />
                          <button
                            onClick={() =>
                              handleRemoveFromList(item.productInfoId)
                            }
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 shrink-0"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Package
                    className={`w-12 h-12 mb-4 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Chưa có sản phẩm nào được chọn
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-100 px-6 py-4 border-t transition-colors duration-300 ${
            themeMode === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`text-sm transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Tổng:{" "}
              {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} sản
              phẩm
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`px-5 py-2 rounded-lg border transition cursor-pointer ${
                  themeMode === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                Huỷ
              </button>
              <button
                onClick={handleSubmitAll}
                disabled={selectedItems.length === 0}
                className={`px-6 py-2 rounded-lg transition cursor-pointer font-medium ${
                  selectedItems.length > 0
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                <Package size={18} /> Thêm tất cả vào kho (
                {selectedItems.length})
              </button>
            </div>
          </div>
        </div>
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
                src={getImageUrl(product.image) || "/placeholder-image.jpg"}
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
                              src={getImageUrl(info.image)}
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
