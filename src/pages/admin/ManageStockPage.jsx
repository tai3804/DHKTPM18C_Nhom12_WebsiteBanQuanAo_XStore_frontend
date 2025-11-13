import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getStocks, deleteStock } from "../../slices/StockSlice";
import { toast } from "react-toastify";
import { Edit2, Trash2 } from "lucide-react";
import SearchBar from "../../components/admin/SearchBar";
import StockForm from "../../components/admin/StockForm";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ManageStockPage = () => {
  const dispatch = useDispatch();
  const { stocks, loading } = useSelector((state) => state.stock);
  const themeMode = useSelector(selectThemeMode);

  const [showForm, setShowForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getStocks());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedStock(null);
    setShowForm(true);
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedStock(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    dispatch(getStocks());
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa kho hàng này?")) {
      dispatch(deleteStock(id))
        .unwrap()
        .then(() => {
          toast.success("Đã xóa kho hàng thành công!");
          dispatch(getStocks());
        })
        .catch((err) => {
          toast.error(`Lỗi khi xóa kho hàng: ${err.message}`);
        });
    }
  };

  const filteredStocks = stocks.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = `${s.name || ""} ${s.code || s.sku || ""} ${s.location || ""} ${s.description || ""} ${s.id || ""}`.toLowerCase();
    return haystack.includes(q);
  });

  return (
   <div className="space-y-6 relative">
      {/* Breadcrumb */}
      <div className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${
        themeMode === "dark" ? "text-gray-400" : "text-gray-500"
      }`}>
        <Link
          to="/admin/dashboard"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          to="/admin/stocks"
          className={`hover:underline cursor-pointer transition-colors ${
            themeMode === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Kho hàng
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-100" : "text-gray-800"
          }`}>
            Quản lý kho hàng
          </h1>
          <p className={`text-sm transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            Quản lý các kho hàng hiện có
          </p>
        </div>
        <button
          onClick={handleAdd}
          className={`px-4 py-2 text-white text-sm rounded-lg transition cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
            themeMode === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          + Thêm kho
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-4">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Tìm kiếm kho theo tên..."
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* Stock Form Modal */}
      {showForm && (
        <StockForm
          stock={selectedStock}
          onCancel={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}

      {/* Table */}
      <div className={`rounded-xl shadow-sm border overflow-x-auto transition-colors duration-300 ${
        themeMode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}>
        <table className="w-full text-left border-collapse min-w-max">
          <thead className={`border-b transition-colors duration-300 ${
            themeMode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}>
            <tr>
              {["ID", "Tên kho", "Email", "Điện thoại", "Hành động"].map((th) => (
                <th key={th} className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-600"
                } ${th === "Hành động" ? "text-right" : ""}`}>
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={`py-6 text-center transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  Đang tải danh sách kho...
                </td>
              </tr>
            ) : filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <tr
                  key={stock.id}
                  className={`border-b transition-colors duration-300 cursor-pointer ${
                    themeMode === "dark"
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <td className={`px-4 py-3 transition-colors duration-300 ${themeMode === "dark" ? "text-gray-200" : "text-gray-700"}`}>{stock.id}</td>
                  <td className={`px-4 py-3 transition-colors duration-300 ${themeMode === "dark" ? "text-gray-200" : "text-gray-700"}`}>{stock.name}</td>
                  <td className={`px-4 py-3 transition-colors duration-300 ${themeMode === "dark" ? "text-gray-200" : "text-gray-700"}`}>{stock.email}</td>
                  <td className={`px-4 py-3 transition-colors duration-300 ${themeMode === "dark" ? "text-gray-200" : "text-gray-700"}`}>{stock.phone}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(stock)}
                      className={`transition cursor-pointer ${
                        themeMode === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(stock.id)}
                      className={`transition cursor-pointer ${
                        themeMode === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-800"
                      }`}
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={`py-6 text-center transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  Không có kho hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStockPage;
