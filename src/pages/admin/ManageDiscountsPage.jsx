import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Edit2, Trash2 } from "lucide-react";
import { getDiscounts, deleteDiscount } from "../../slices/DiscountSlice";
import DiscountForm from "../../components/admin/DiscountForm";
import SearchBar from "../../components/admin/SearchBar";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { Link } from "react-router-dom";

const ManageDiscountsPage = () => {
  const dispatch = useDispatch();
  const { discounts = [] } = useSelector((state) => state.discount || {});
  const loading = useSelector((state) => state.loading.active);
  const themeMode = useSelector(selectThemeMode);

  const [showForm, setShowForm] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getDiscounts());
  }, [dispatch]);

  // Debug: Log dữ liệu discount
  useEffect(() => {
    if (discounts.length > 0) {
      console.log("Sample discount data:", discounts[0]);
      console.log("⚠️ isActive value:", discounts[0].isActive);
      console.log("⚠️ isActive type:", typeof discounts[0].isActive);
      console.log(
        "⚠️ All discounts:",
        discounts.map((d) => ({ id: d.id, name: d.name, isActive: d.isActive }))
      );
    }
  }, [discounts]);

  const handleAdd = () => {
    setSelectedDiscount(null);
    setShowForm(true);
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa giảm giá này?")) return;
    try {
      await dispatch(deleteDiscount(id)).unwrap();
      toast.success("Xóa giảm giá thành công!");
      dispatch(getDiscounts());
    } catch (err) {
      toast.error("Lỗi khi xóa: " + err.message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedDiscount(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    dispatch(getDiscounts());
  };

  const filtered = discounts.filter((d) => {
    const q = (searchQuery || "").trim().toLowerCase();
    return (
      d.code?.toLowerCase().includes(q) ||
      d.name?.toLowerCase().includes(q) ||
      d.title?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  const headerTextClass = `text-2xl font-bold transition-colors duration-300 ${
    themeMode === "dark" ? "text-gray-100" : "text-gray-800"
  }`;
  const subTextClass = `text-sm transition-colors duration-300 ${
    themeMode === "dark" ? "text-gray-400" : "text-gray-500"
  }`;
  const tableBgClass =
    themeMode === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-100";
  const tableHeaderClass =
    themeMode === "dark"
      ? "bg-gray-700 border-gray-600 text-gray-300"
      : "bg-gray-50 border-gray-200 text-gray-600";
  const rowHoverClass =
    themeMode === "dark"
      ? "border-gray-700 hover:bg-gray-700"
      : "border-gray-100 hover:bg-gray-50";
  const noDataClass = themeMode === "dark" ? "text-gray-400" : "text-gray-500";
  const buttonAddClass = `px-4 py-2 text-white text-sm rounded-lg transition cursor-pointer ${
    themeMode === "dark"
      ? "bg-indigo-600 hover:bg-indigo-700"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`;

  return (
    <div className="space-y-6 relative">
      {/* Breadcrumb */}
      <div className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${themeMode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        <Link to="/admin/dashboard" className="hover:underline">Trang chủ</Link>
      <div
        className={`text-sm mb-2 flex items-center gap-1 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <Link to="/admin/dashboard" className="hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/admin/discounts" className="hover:underline">
          Giảm giá
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className={headerTextClass}>Quản lý giảm giá</h1>
          <p className={subTextClass}>Tạo, chỉnh sửa, xóa mã giảm giá</p>

          <div className="mt-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Tìm kiếm theo mã, tên, tiêu đề, mô tả..."
              onClear={() => setSearchQuery("")}
            />
          </div>
        </div>

        <button onClick={handleAdd} className={buttonAddClass}>
          + Thêm giảm giá
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className={`text-center py-8 transition-colors ${noDataClass}`}>
          Đang tải danh sách giảm giá...
        </div>
      ) : filtered.length > 0 ? (
        <div className={`rounded-xl shadow-sm border overflow-x-auto transition-colors ${tableBgClass}`}>
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr>
                {["ID","Tên / Tiêu đề","Mô tả","Loại","Giảm","Trạng thái","Thời gian","Hành động"].map((title, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 text-sm font-semibold transition-colors duration-300 ${tableHeaderClass} ${title === "Hành động" ? "text-right" : ""}`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((d) => (
                <tr
                  key={d.id || d._id}
                  className={`border-b transition-colors duration-300 ${rowHoverClass}`}
                >
                  <td className="px-4 py-3">{d.id || d._id}</td>
                  <td className="px-4 py-3">
                    {d.name || "—"} <br />
                    <span className="text-gray-500 text-sm">
                      {d.title || ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">{d.description || "—"}</td>
                  <td className="px-4 py-3">
                    {d.type === "PERCENT" ? "Phần trăm" : "Cố định"}
                  </td>
                  <td className="px-4 py-3">
                    {d.type === "PERCENT"
                      ? `${d.discountPercent}%`
                      : d.discountAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {d.validUserType
                      ? d.validUserType === "COPPER"
                        ? "Đồng"
                        : d.validUserType === "SILVER"
                        ? "Bạc"
                        : d.validUserType === "GOLD"
                        ? "Vàng"
                        : d.validUserType === "PLATINUM"
                        ? "Bạch kim"
                        : d.validUserType
                      : "Tất cả"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        d.isActive || d.isActive === 1 || d.isActive === "true"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {d.isActive || d.isActive === 1 || d.isActive === "true"
                        ? "Hoạt động"
                        : "Vô hiệu"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {d.startDate ? d.startDate.slice(0, 10) : "—"} —{" "}
                    {d.endDate ? d.endDate.slice(0, 10) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className={`inline-flex transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className={`inline-flex transition-colors duration-300 ${
                        themeMode === "dark"
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-600 hover:text-red-800"
                      }`}
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
        <div className={`text-center py-8 transition-colors ${noDataClass}`}>
          {searchQuery
            ? "Không tìm thấy giảm giá nào khớp với tìm kiếm"
            : "Không có giảm giá nào"}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <DiscountForm
          discount={selectedDiscount}
          onCancel={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ManageDiscountsPage;
