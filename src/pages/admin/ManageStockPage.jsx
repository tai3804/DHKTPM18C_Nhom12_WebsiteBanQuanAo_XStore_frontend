import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getStocks, deleteStock } from "../../slices/StockSlice";
import { toast } from "react-toastify";
import StockForm from "../../components/admin/StockForm";
import { Edit, Trash2 } from "lucide-react";

const ManageStockPage = () => {
  const dispatch = useDispatch();
  const { stocks, loading } = useSelector((state) => state.stock);
  const [showForm, setShowForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

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

  return (
    <div className="space-y-6 relative">
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
          to="/admin/stocks"
          className="hover:underline text-gray-600 cursor-pointer transition-colors"
        >
          Kho hàng
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý kho hàng
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý các kho hàng hiện có
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition flex items-center gap-1 cursor-pointer"
        >
          + Thêm kho
        </button>
      </div>

      <StockForm
        showForm={showForm}
        setShowForm={setShowForm}
        stock={selectedStock}
        onSuccess={handleSuccess}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Tên kho
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Điện thoại
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  Đang tải danh sách kho...
                </td>
              </tr>
            ) : stocks && stocks.length > 0 ? (
              stocks.map((stock) => (
                <tr
                  key={stock.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-700">{stock.id}</td>
                  <td className="px-4 py-3 text-gray-700">{stock.name}</td>
                  <td className="px-4 py-3 text-gray-700">{stock.email}</td>
                  <td className="px-4 py-3 text-gray-700">{stock.phone}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(stock)}
                      className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(stock.id)}
                      className="text-red-600 hover:text-red-800 transition cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
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
